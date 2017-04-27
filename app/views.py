import json, datetime
from app import app, db
from flask import render_template, redirect, request, abort
from .models import Category, Item, Sale, Sale_Item

@app.route("/", methods=['GET', 'POST'])
def index():
	categories = Category.query.order_by(Category.weight).all()
	if not categories:
		return redirect("/admin#addCategoryTab")
	return render_template("transactions.html", title="Transactions", 
		categories=categories)

@app.route("/tabs")
def tabs():
	unpaidSales = Sale.query.filter_by(paid=False).all()
	tabs = {}
	for sale in unpaidSales:
		if sale.tab_name not in tabs:
			tabs[sale.tab_name] = {}
			tabs[sale.tab_name]['sales'] = []
			tabs[sale.tab_name]['value'] = 0
		tabs[sale.tab_name]['sales'].append(sale)
		tabs[sale.tab_name]['value'] = tabs[sale.tab_name]['value'] + sale.value
	return render_template("tabs.html", title="Tabs",
		tabs=tabs)
	
@app.route("/sales")
@app.route("/sales/<fromDate>/<toDate>")
def sales(fromDate = None, toDate = None):
	if(fromDate and toDate):
		fromDate = datetime.datetime.strptime(fromDate, "%Y-%m-%d").date()
		toDate = datetime.datetime.strptime(toDate, "%Y-%m-%d").date() + datetime.timedelta(days=1)
		sales = Sale.query.filter(Sale.time >= fromDate, Sale.time < toDate).all()
		detailsPerItem = {}
		for sale in sales:
			for saleItem in sale.items:
				if saleItem.name in detailsPerItem:
					addedQuantity = False
					for obj in detailsPerItem[saleItem.name]:
						if saleItem.price_single == obj['price']:
							obj['quantity'] += saleItem.quantity
							addedQuantity = True
					if not addedQuantity:
						detailsPerItem[saleItem.name].append({"price" : saleItem.price_single, "quantity" : saleItem.quantity})
						
				else:
					detailsPerItem[saleItem.name] = [{"price" : saleItem.price_single, "quantity" : saleItem.quantity}]
		return render_template("sales.html", title="Sales",
			sales=sales,
			fromDate=fromDate,
			toDate=toDate-datetime.timedelta(days=1),
			details=detailsPerItem)
	return render_template("sales.html", title="Sales",
			sales=None)
	
	
@app.route("/admin", methods=['GET', 'POST'])
def admin():
	categories = Category.query.order_by(Category.weight).all()
	items = Item.query.order_by(Item.category_id).all()
	return render_template("admin.html", title="Administration",
		categories=categories,
		items=items)
	
@app.route("/sale", methods=['POST'])
def sale():
	data = request.get_json(force=True)
	totalValue=0
	for item in data['cart']:
		totalValue+=(item['price']*item['quantity'])
		
	sale = Sale(value=totalValue, paid=data['paid'], time=datetime.datetime.now(), tab_name=data['tab_name'])
	db.session.add(sale)
	db.session.commit()
	for item in data['cart']:
		sale_item=Sale_Item(item_id=item['id'], sale_id=sale.id, name=item['name'], price_single=item['price'], quantity=item['quantity'], price_total=(item['price']*item['quantity']))
		db.session.add(sale_item)
		db.session.commit()
	return "complete"
	
@app.route("/paytab", methods=['POST'])
def payTab():
	unpaidSales = Sale.query.filter_by(paid=False).all()
	data = request.get_json(force=True)
	tabName = data['tabName']
	for sale in unpaidSales:
		if sale.tab_name == tabName:
			sale.paid = True
			db.session.commit()
	return "complete"
	
@app.route("/additem", methods=['POST'])
def addItem():
	data = request.get_json(force=True)
	price = int(float(data['price']) * 100)
	category = Category.query.filter_by(name=data['category']).first()
	item = Item(name=data['name'], price=price, on_sale=True, category=category)
	db.session.add(item)
	db.session.commit()
	
	return "complete"
	
@app.route("/edititem", methods=['POST'])
def editItem():
	data = request.get_json(force=True)
	if data['operation'] == "edit":
		item = Item.query.filter_by(id=data['id']).first()
		item.name = data['name']
		item.price = data['price']
		item.category = Category.query.filter_by(id=data['category']).first()
		item.on_sale = data['on_sale']
		db.session.commit()
		return "complete"
	elif data['operation'] == "delete":
		item = Item.query.filter_by(id=data['id']).first()
		for saleitem in item.sales:
			db.session.delete(saleitem.sale)
			db.session.delete(saleitem)
		db.session.delete(item)
		db.session.commit()
		return "complete"
	
@app.route("/addcategory", methods=['POST'])
def addCategory():
	data = request.get_json(force=True)
	if Category.query.filter_by(name=data['name']).first() is not None:
		abort(400)
	if Category.query.order_by(Category.weight.desc()).first() is None:
		newWeight = 1
	else:
		newWeight = Category.query.order_by(Category.weight.desc()).first().weight + 1
	category = Category(name=data['name'], weight=newWeight)
	db.session.add(category)
	db.session.commit()
	
	return "complete"
	
@app.route("/editcategory", methods=['POST'])
def editCategory():
	data = request.get_json(force=True)
	if data['operation'] == "edit":
		if (Category.query.filter(Category.name == data['name']).filter(Category.id != data['id']).first() is not None) or (Category.query.filter(Category.weight == data['weight']).filter(Category.id != data['id']).first() is not None):
			abort(400)
		category = Category.query.filter_by(id=data['id']).first()
		#if Category.query.filter_by(name=data['name']).first() is None:
		category.name = data['name']
		#if Category.query.filter_by(weight=data['weight']).first() is None:
		category.weight = data['weight']
		db.session.commit()
		return "complete"
	elif data['operation'] == "delete":
		category = Category.query.filter_by(id=data['id']).first()
		items = category.items
		for item in items:
			for saleitem in item.sales:
				db.session.delete(saleitem.sale)
				db.session.delete(saleitem)
			db.session.delete(item)
		db.session.delete(category)
		db.session.commit()
		return "complete"