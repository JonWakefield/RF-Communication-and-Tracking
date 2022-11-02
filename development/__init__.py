from flask import Flask
from flask_sqlalchemy import SQLAlchemy

database = SQLAlchemy()
DB_NAME = "database.db"



# clear files before each start:
try:
    file_to_delete = open("development\documents\messages.csv",'w')
    file_to_delete.close()
except:
    print("unable to open file to clear:")

try:
    file_to_delete = open("development\documents\\beaconstate.csv",'w')
    file_to_delete.close()
except:
    print("unable to open file to clear:")



def create_app():
    app = Flask(__name__) # __name__ name of file
    app.config['SECRET_KEY'] = 'lsdjfnvuasla auefiubjdsbfa' # secret key
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    database.init_app(app)

    from .routes import routes #import connection to home web page

    app.register_blueprint(routes, url_prefix='/') 

    return app