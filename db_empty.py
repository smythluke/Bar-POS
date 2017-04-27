from app import db
for table in reversed(db.metadata.sorted_tables):
	print('Clear table %s' % table)
	db.session.execute(table.delete())
db.session.commit()