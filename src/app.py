# -*- coding: utf-8 -*-

import os
import random
import datetime
from datetime import date

from flask import Flask, render_template, request, redirect, flash, url_for, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_user, login_required, current_user, logout_user

from src import app, login_manager, r, db
from models import Author, SuggestedPrompt, Prompt, Piece, Feedback

app.app_context().push()

@app.route('/')
def landing():
    user_id = request.cookies.get('YourSessionCookie')
    if user_id:
        print(user_id)
        num = int(user_id)
        user = Author.query.get(num)
        if user:
            login_user(user)
            return redirect(url_for("home"))
        else:
            return render_template('landing.html')
    else:
        return render_template('landing.html')

@app.route('/home')
@login_required
def home():
    return render_template('home.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/writing')
@app.route('/writing/<pid>')
@login_required
def writing(pid=None):
    if not pid:
        return render_template("writing.html")
    else:
        if(current_user.has_piece_for_pid(pid)):
            return render_template("writing.html")
            #TODO: Somehow pass in pid/authorid for ajax save
        else:
            new_piece = Piece(current_user.id, "", pid)
            return render_template("writing.html")

@app.route('/tavern')
@login_required
def tavern():
    return render_template('tavern.html')

@app.route('/reading')
@login_required
def reading():
    return render_template('reading.html')

@app.route('/user')
@login_required
def userpage():
    return render_template('myWork.html')

###
# API
###

@app.route("/save", methods=["POST"])
@login_required
def save():
    try:
        p_id = request.form['prompt_id']
        text = request.form['text']
        piece = Piece.get_piece(author_id=current_user.id, prompt_id=p_id)
        if(piece):
            piece.update(text)
            return "SUCCESS"
        else:
            Piece.add_new_piece(current_user.id, text, p_id)
            return "SUCCESS"
    except Exception as e:
        print(e)
        return "FAILURE"

@app.route("/loadrandom", methods=["POST"])
@login_required
def load_random():
    p_id = request.form['prompt_id']
    pieces = Piece.query.filter_by(prompt_id=p_id).all()
    pieces = filter(lambda x: x.is_published, pieces)
    pieces = filter(lambda x: x.author_id != current_user.id, pieces)
    seen = r.lrange("a" + str(current_user.id), 0, -1) # We expect a list of strings of shape 'prompt_id,author_id'
    if(seen):
        seen = map(int, seen)
        pieces = filter(lambda x: x.id not in seen, pieces)
    else:
        seen = []

    if(pieces):
        piece = random.choice(pieces)
        r.lpush("a" + str(current_user.id), str(piece.id))
        feedback = Feedback.query.filter_by(piece_id=piece.id, author_id=current_user.id).first()
        if(not feedback):
            db.session.add(Feedback(piece.id, current_user.id))
            db.session.commit()
        print(piece.id)
        return jsonify(dict(piece_id=piece.id, text=piece.text, like=0))
    else:
        return jsonify(dict(text="You've read all the response's so far!",))

@app.route("/load", methods=["POST"])
@login_required
def load():
    p_id = request.form['prompt_id']
    piece = Piece.get_piece(author_id=current_user.id, prompt_id=p_id)
    if(piece):
        return piece.text
    else:
        return ""

@app.route("/publish", methods=["POST"])
@login_required
def publish():
    p_id = request.form['prompt_id']
    piece = Piece.get_piece(author_id=current_user.id, prompt_id=p_id)
    if(piece and piece.text):
        piece.is_published = True
        r.lpush("p" + str(piece.prompt_id), str(piece.id))
        db.session.commit()
        return "SUCCESS"
    else:
        print("publish failed")
        return "Publish Unsuccessful"

@app.route("/ispublished",methods=["POST"])
@login_required
def ispublished():
    isp = False
    pid = request.form['pid']
    piece = Piece.get_piece(author_id=current_user.id, prompt_id=pid)
    if(piece):
        if(piece.is_published):
            isp = True
            return  "1"
        else:
            return "0"
    else:
        return "0"





@app.route('/getprompts', methods=["POST"])
def getprompts():
    now = datetime.datetime.now()
    start = date(2016, 12, 20)
    today = date(now.year,now.month,now.day)
    days = today - start
    p1 = days.days
    p7 = days.days + 7
    prompts = []
    pList= []
    for e in range(p1,p7):
        prompt = Prompt.get_prompts(e)
        prompts.append(prompt)
    for i in reversed(prompts):
        pList.append(i)

    return jsonify(map(lambda x: dict(text= x.prompt, pid = x.id),pList))

@app.route('/getpieces', methods=["POST"])
def getpieces():
    pieces = Piece.query.all()
    pieces = filter(lambda x: x.author_id == current_user.id, pieces)
    return jsonify(map(lambda x: dict(piece = x.id, text = x.text, prompt = x.prompt_id, date = x.date_started),pieces))

@app.route('/getfavorites', methods=["POST"])
@login_required
def getfavoritepieces():
    favorites = Feedback.query.filter_by(author_id=current_user.id, vote=1).all()
    pieces = []
    for e in favorites:
        piece = Piece.query.filter_by(id=e.piece_id).first()
        pieces.append(piece)
    return jsonify(map(lambda x: dict(piece = x.id, text = x.text, prompt = x.prompt_id, date = x.date_started),pieces))

@app.route('/getpenname', methods=["POST"])
@login_required
def get_pen_name():
    print(current_user.penname)
    return str(current_user.penname)

@app.route('/checkUN', methods=['POST'])
def checkUN():
    email = request.form["email"]
    is_taken = Author.query.filter_by(email=email).first()
    if(not is_taken):
        return "SUCCESS"
    else:
        return "fail"

@app.route('/checkPN', methods=['POST'])
def checkPN():
    penname = request.form["penname"]
    is_taken = Author.query.filter_by(penname=penname).first()
    if(not is_taken):
        return "SUCCESS"
    else:
        return "fail"


@app.route('/signup', methods=["POST"])
def signup():
    email = request.form["email"]
    password = request.form["password"]
    penname = request.form["penname"]
    is_valid = Author.validate_form(request.form)
    error = None
    if(is_valid):
        author = Author.add_new_author(email, password, penname)
        login_user(author,remember=True)
        response = redirect(url_for("home"))
        response.set_cookie('YourSessionCookie', str(author.id))
        return response
    else:
        flash("Signup failed")
        error = 'Invalid credentials'
    return redirect('/')

@app.route('/login', methods=["POST"])
def login():
    error=None
    email = request.form["email"]
    password = request.form["password"]
    if(Author.validate_login(email, password)):
        author = Author.get_by_email(email)
        login_user(author,remember=True)
        response = redirect(url_for("home"))
        response.set_cookie('YourSessionCookie', str(author.id))
        return response
    else:
        error = 'Invalid credentials'
        print("Incorrect Username or Password")
        return redirect('/')

@app.route("/logout")
@login_required
def logout():
    logout_user()
    resp = redirect('/')
    resp.set_cookie('YourSessionCookie', "",expires=0)
    return resp

@app.route('/prompt', defaults={'pid': None}, methods=["GET"])
@app.route('/prompt/<pid>', methods=["GET"])
@login_required
def get_prompt(pid):
    if(pid == None):
        return "Random prompt here"

    prompt = Prompt.query.filter_by(id=pid).first()

    if(not prompt):
        return "No prompt :-("
    return str(prompt.prompt)

@app.route('/findprompt', methods=["POST"])
def findprompt():
    pid = request.form['pid']
    prompt = Prompt.query.filter_by(id =pid).first()
    return str(prompt.prompt)

@app.route('/addprompt/<prompt>', methods=['GET'])
@login_required
def add_prompt(prompt):
    sug = SuggestedPrompt(prompt,current_user.id)
    db.session.add(sug)
    db.session.commit()
    db.session.close()
    return redirect(url_for("thanks"))

@app.route("/thanks")
@login_required
def thanks():
    return render_template("submitted.html")

@app.route('/getauthor',methods=['POST'])
@login_required
def get_author():
    if(int(request.form["piece_id"])):
        piece = Piece.query.filter_by(id=int(request.form["piece_id"])).first()
        if(piece):
            author = Author.query.filter_by(id = int(piece.author_id)).first()
            return jsonify({"author":str(author.penname)})
        else:
            return jsonify({"author":" "})
    else:
        return jsonify({"author":" "})





@app.route('/vote', methods=['POST'])
@login_required
def vote():
    feedback = Feedback.query.filter_by(author_id=current_user.id, piece_id=int(request.form["piece_id"])).first()
    value = int(feedback.vote)
    if(not feedback):
        feedback = Feedback(int(request.form["piece_id"]), current_user.id, 1, "")
        db.session.add(feedback)
    else:
        feedback.vote = 0 if feedback.vote else 1
        value = int(feedback.vote)
    db.session.commit()
    return jsonify({"like":value}),200

@app.route('/votetotal', methods=['POST'])
def getvotes():
    pid = request.form['piece']
    vote_total = len(Feedback.query.filter_by(piece_id=pid,vote=1).all())
    return str(vote_total)



@app.route('/comment', methods=['POST'])
@login_required
def comment():
    feedbacks = Feedback.query.filter_by(piece_id=int(request.form["piece_id"])).all()
    feedbacks = map(lambda o:(o.author_id, o.comment), feedbacks)
    data = []
    for e in feedbacks:
        name = Author.query.filter_by(id=e[0]).first().penname
        comment = e[1]
        if(comment != ""):
            data.append(dict(name = name, comment = e[1]))
    return jsonify(data),200

@app.route('/newcomment', methods=['POST'])
@login_required
def new_comment():
    author = current_user.first
    text = request.form['text']
    piece_id= int(request.form["pieceID"])
    feedback = Feedback.query.filter_by(author_id=current_user.id, piece_id=piece_id).first()
    if(not feedback):
        new_feedback = Feedback(piece_id, current_user.id, 0, text)
        db.session.add(new_feedback)
    else:
        feedback.comment = text
    db.session.commit()
    print("commited sucesfully")
    return "success"


"""
@app.route('/addcomment', methods=['POST'])
@login_required
def add_comment():
    author = current_user.first
    text = request.form['text']
    piece_id= int(request.form["pieceID"])
    comment = Comment.query.filter_by(author_id=current_user.id, piece_id=piece_id).first()
    if(not feedback):
        comment = Comment(piece_id, current_user.id, text)
        db.session.add(comment)
    else:
        new_comment = Comment(piece_id, current_user.id, text)
        db.session.add(new_comment)
    db.session.commit()
    print("commited sucesfully")
    return "success"
"""


###
# Login Manager
###

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=600'
    return response


###
# Errors
###

@app.errorhandler(404)
def fourohfour(e):
    return render_template("404.html")

@app.errorhandler(500)
def fivehundred(e):
    return render_template("500.html")

@login_manager.unauthorized_handler
def unauthorized():
    return render_template('401.html'), 401

@login_manager.user_loader
def load_user(user_id):
    return Author.query.get(int(user_id))
