from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

import os

app = Flask(__name__)
app.config.update(DEBUG=True)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:root@localhost/dev"
db = SQLAlchemy(app)

from models import Author, Writing, Prompt, SuggestedPrompt

@app.route('/landing')
@app.route('/landing')
def hello(name=None):
    return render_template('landing.html', name=name)

@app.route('/reading')
def reading():
    return render_template('reading.html')

@app.route('/prompts')
def prompts():
    return render_template('prompts.html')

@app.route('/user')
def user():
    return return_template('user.html')

@app.route('/')
def root():
    username = request.cookies.get('username')
    if(username):
        return render_template("main.html")
    else:
        return render_template("main.html")

@app.route('/login', methods=["POST"])
def login():
    return redirect('/')

@app.route('/prompt', defaults={'pid': None}, methods=["GET"])
@app.route('/prompt/<pid>', methods=["GET"])
def get_prompt(pid):
    if(pid == None):
        return "Random prompt here"
    prompt = Prompt.query.filter_by(promptid=pid).first()
    if(not prompt):
        return "No prompt :-("
    return str(prompt.prompt)

@app.route('/addprompt/<prompt>', methods=['GET'])
def add_prompt(prompt):
    #if(not request.cookies.get('username')):
    #    print("Rejected!")
    #    return "Please login to suggest a prompt."
    db.session.add(SuggestedPrompt(prompt))
    db.session.commit()
    return "Thank you for your submission! It will be put under consideration."

@app.route('/signup', methods=['POST'])
def signup_user():
    print(request)
