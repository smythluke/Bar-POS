from app import db

class Category(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), index=True, unique=True)
	weight = db.Column(db.Integer, index=True, unique=True)
	items = db.relationship('Item', backref='category', lazy='dynamic')

	def __repr__(self):
		return '<Category {0}>'.format(self.name)

class Item(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	name= db.Column(db.String(128))
	price = db.Column(db.Integer)
	on_sale = db.Column(db.Boolean)
	category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
	sales = db.relationship('Sale_Item', backref='item', lazy='dynamic')
	
	def __repr__(self):
		return '<Item {0}>'.format(self.name)

class Sale(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	value = db.Column(db.Integer, index=True)
	paid = db.Column(db.Boolean, index=True)
	time = db.Column(db.DateTime, index=True)
	tab_name = db.Column(db.String(64))
	items = db.relationship('Sale_Item', backref='sale', lazy='dynamic')
	
	def __repr__(self):
		return '<Sale {0} - {1}>'.format(self.time, self.value)

class Sale_Item(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	item_id = db.Column(db.Integer, db.ForeignKey('item.id'))
	sale_id = db.Column(db.Integer, db.ForeignKey('sale.id'))
	name = db.Column(db.String(128))
	price_single = db.Column(db.Integer)
	quantity = db.Column(db.Integer)
	price_total = db.Column(db.Integer)
	
	def __repr__(self):
		return '<Sale_Item sale:{0}, item:{1}>'.format(self.sale_id, self.item_id)