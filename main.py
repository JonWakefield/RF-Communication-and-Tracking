import flask
from development import create_app

app = create_app()

if __name__ == '__main__':
    
    app.run(debug=True) # runs webserver debug=True -> any time a change is made, page is updated on its on.

