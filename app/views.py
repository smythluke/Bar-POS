import json, datetime
from app import app, db
from flask import render_template, redirect, request
from .models import Category, Item, Sale, Sale_Item
from .forms import AddCategoryForm, DeleteCategoryForm, AddItemForm, DeleteItemForm

@app.route("/", methods=['GET', 'POST'])
def index():
	categories = Category.query.order_by(Category.weight).all()
	
	
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
	

@app.route("/admin")
def admin():
	addCategoryForm = AddCategoryForm()
	deleteCategoryForm = DeleteCategoryForm()
	addItemForm = AddItemForm()
	deleteItemForm = DeleteItemForm()
	
	deleteCategoryForm.id.choices = [(c.id, c.name) for c in Category.query.order_by('weight').all()]
	addItemForm.category_id.choices = [(c.id, c.name) for c in Category.query.order_by('weight').all()]
	deleteItemForm.id.choices = [(i.id, i.name) for i in Item.query.all()]
	
	if addCategoryForm.addCategory.data and addCategoryForm.validate_on_submit():
		if Category.query.order_by(Category.weight.desc()).first() is None:
			newWeight = 1
		else:
			newWeight = Category.query.order_by(Category.weight.desc()).first().weight + 1
		c = Category(name=addCategoryForm.name.data, weight=newWeight)
		db.session.add(c)
		db.session.commit()
		return redirect('/')
		
	if deleteCategoryForm.deleteCategory.data and deleteCategoryForm.validate_on_submit():
		c = Category.query.get(deleteCategoryForm.id.data)
		db.session.delete(c)
		db.session.commit()
		return redirect('/')
		
	if addItemForm.addItem.data and addItemForm.validate_on_submit():
		p = int(addItemForm.price.data * 100)
		print(p)
		c = Category.query.get(addItemForm.category_id.data)
		i = Item(name=addItemForm.name.data, price=p, on_sale=True, category=c)
		db.session.add(i)
		db.session.commit()
		return redirect('/')
		
	if deleteItemForm.deleteItem.data and deleteItemForm.validate_on_submit():
		i = Item.query.get(deleteItemForm.id.data)
		db.session.delete(i)
		db.session.commit()
		return redirect('/')
		
	return render_template("admin.html", title="Administration",
		addCategoryForm=addCategoryForm,
		deleteCategoryForm=deleteCategoryForm,
		addItemForm=addItemForm,
		deleteItemForm=deleteItemForm)
	
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