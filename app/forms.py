from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, SubmitField, SelectField, DecimalField
from wtforms.validators import DataRequired

class AddCategoryForm(FlaskForm):
	name = StringField('name', validators=[DataRequired()])
	addCategory = SubmitField('Add Category')
	
class DeleteCategoryForm(FlaskForm):
	id = SelectField('Category', validators=[DataRequired()], coerce=int)
	deleteCategory = SubmitField('Delete Category')
	
class AddItemForm(FlaskForm):
	name = StringField('name', validators=[DataRequired()])
	price = DecimalField('price', places=2, validators=[DataRequired()])
	category_id = SelectField('Category', validators=[DataRequired()], coerce=int)
	addItem = SubmitField('Add Item')
	
class DeleteItemForm(FlaskForm):
	id = SelectField('Item', validators=[DataRequired()], coerce=int)
	deleteItem = SubmitField('Delete Item')