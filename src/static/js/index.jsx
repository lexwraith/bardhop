/* UTILITIES */

var inArray = function( element, array) {
  for(var i = array.length - 1; i < array.length; i++ ){
    if(element.localeCompare(array[i]) === 0){
      return true;
    }
    else {
      return false;
    }
  }
}

var comSubmit = function(){
$('#comment_submit').submit(function(e) {
    e.preventDefault();
    console.log("test conSubit 2");
    return false;
});
}

var pubButton = function(){
  $("#publish-button").click(function() {
    document.getElementById("publish-button").className = 'btn submitted';
  });
}

var IO = function() {
  SAVE_INTERVAL = 500;
  autoSave = null; // Save Timeout object
  saveObject = null; // Save request object
  loadObject = null; // Load request object
  voteObject = null; // Vote
  commentObject = null

  var NewPrompt = function(){
    var init = new Date(2012, 11, 29);
    var now = Date.now();
    var diff = now - initialDate;
    var timeMili = 24 * 60 * 60 * 1000;
    var daysSince = Math.floor(difference / timeMili);
    return daysSince;
  }

  var loginHandler = function(){
    var data = {};
    var inputs = $('#login-form :input');
      $('#login-submit').each(function(e){
        data[e.name] = e.value;
      });
  }

  var saveText = function(pid) {

    var doc = document.querySelector('#text');
    var text = doc.innerHTML;
    var data = {
      prompt_id: pid,
      //text: $('#text').text(),
      text: text,
    };
    if(saveObject){
        saveObject.abort();
        saveObject = null;
    }
    saveObject = $.post('/save',
      data=data,
      function(response, status_code, xhr){
        if(response === 'SUCCESS'){
        } else {
          console.log("Save failed.");
        }
      });
  };

  var publishText = function(pid) {
    var data = {
      prompt_id: pid,
    }
    $.post('/publish',
      data=data,
      function(response, status_code, xhr){
        if(response === 'SUCCESS'){
        } else {
          saveText(pid);
          console.log("Published failed");
        }
      });
  };

  var loadText = function(pid) {
    var retText = ""
    var data = {
      prompt_id: pid,
    };
    $.post('/load',
      data=data,
      function(text, status_code, xhr){
        if(status_code === 'success'){
          $('#text').html(text);
          wordCount();
        } else {
          console.log('load fail');
        }
      });
  };

  var loadFrontText = function(pid) {
    var retText = ""
    var data = {
      prompt_id: pid,
    };
    $.post('/load',
      data=data,
      function(text, status_code, xhr){
        if(status_code === 'success'){
          $('#promptText').html(text);
        } else {
          console.log('load fail');
        }
      });
  };

  var loadRandomText = function(pid) {
    var data = {
      prompt_id: pid,
    };
    if(loadObject) {
        loadObject.abort();
        loadObject = null;
    }
    loadObject = $.post('/loadrandom',
      data=data,
      function(response, status_code, xhr){
        if(status_code === 'success'){
          $('#text').text(response["text"]);

        } else {
        }
      })
    return piece_id;
  };


  var setAutoSave = function(pid) {
    $("#text").on("input propertychange change keyup input paste", function(e) {
      clearTimeout(autoSave);
      autoSave = setTimeout(function() {
        saveText(pid);
      }, SAVE_INTERVAL);
    });
  }

  var wordCount = function(pid) {
    $("#text").on("input propertychange change keyup input paste", function(e) {
      var text = this.textContent, count = text.trim().replace(/\s+/g, ' ').split(' ').length;
      document.querySelector('.words').textContent = "WordCount: " + count;
    });
    var text =  document.querySelector('#text').textContent;
    count = text.trim().replace(/\s+/g, ' ').split(' ').length;
    if(count == 1){
      count = 0;
    }
    document.querySelector('.words').textContent = "WordCount: " + count;
  }

  var clearLoad = function() {
    loadObject.abort();
    loadObject = null;
  }

  var vote = function(piece_id){
    var data = {piece_id: piece_id};
    voteObject = $.post('/vote',
       data = data,
       function(response,status_code, xhr){
         if(status_code === "success" ){
           return true;
         } else {
           return false;
         }
       });
       return voteObject;
  };

  var comment = function(text,pieceID){
    var data = {
      text:text,
      pieceID:pieceID,
    };
    commentObject =$.post('/comment',
      data = data,
      function(response,status_code, xhr){
        if(status_code === "success"){
        }
        else{
          console.log("comment fail")
        }
      });
      return commentObject;
  }

  return {
    saveText: saveText,
    loadText: loadText,
    loadFrontText: loadFrontText,
    loadRandomText: loadRandomText,
    setAutoSave: setAutoSave,
    publishText: publishText,
    loginHandler: loginHandler,
    clearLoad: clearLoad,
    vote:vote,
    comment:comment,
    wordCount:wordCount,
  };
}();

//Switches between the top entries and the newest entries
class Story extends React.Component {
    constructor() {
        super();
        this.state = {
            favorites: false
        };
        this.handleDisplay = this.handleDisplay.bind(this);
        this.logout = this.logout.bind(this)
    }

    handleDisplay() {
        this.setState({
            favorites: !this.state.favorites
        });
    }

    logout(){
      this.serverRequest = $.post("/logout", function(result){}.bind(this));
    }

    dailyTop(number) {
        if (number == 0) {
            return (<Back/>)
        } else if (number == 1) {
            return (<Front/>)
        }
    }

    render() {
        const textStory = this.state.favorites
            ? 'Go to My Writing'
            : 'Go to My Favorites';
        var mode = this.state.favorites
            ? 0
            : 1;
        return (
          <div>
            <div className="s-tog">
                <div className = "black_box" onClick={this.handleDisplay}><h1>{textStory}</h1></div>
                {this.dailyTop(mode)}
            </div>

          </div>
        )
    }
};


//This function creates the class that renders the template for "reading.html"
class Entry extends React.Component {
    constructor() {
        super();
    }
    render() {
        var {title, pic, author, date, text} = this.props;
        return (
            <div>
                <h1 className="story_title">{title}</h1>
                <div className="profile-box">
                    <img className="author_pic img-circular" src={pic} height={24}/>
                    <div className="author_info">
                        <h1 className="author_name">{author}</h1>
                        <h1 className="date">{date}</h1>
                    </div>
                </div>

                <p className="story_text">{text}</p>
            </div>
        )
    }
};
Entry.propTypes = {
    title: React.PropTypes.string.isRequired // Makes Title a property
};
Entry.defaultProps = {  // initialize title
    title: "Title"
};

/*LANDING PAGE
================================================================================================
These functions are used for the landing page.
================================================================================================
*/

/*
This Page is the firt thing a user see's when they load. It has the login and signup screen.
*/
class Landing extends React.Component{
  constructor(){
    super();
    this.state ={ signupLogin: 1}
    this.handleForm = this.handleForm.bind(this);
  }

  handleForm(signupLogin, event){
    this.setState({signupLogin : !this.state.signupLogin});
  }

  loginHandler(event){
    var response = IO.loginHandler();
  }

  checkForm(signupLogin){
    if(signupLogin == 1){
     return(<Signup loginHandler={this.loginHandler.bind(this)} handleForm ={this.handleForm.bind(this,this.state.signupLogin)}/>);
   }
    else {
      return(<Login handleForm ={this.handleForm.bind(this,this.state.signupLogin)}/>);
    }

  }

  render() {
    return(
      <div>
        <div className = "form-container">
                <h1>BardHop</h1>
          <div id="login">
            {this.checkForm(this.state.signupLogin)}
          </div>
          <div className= "intro">
          </div>
        </div>
      </div>

    );
  }
}

/*
This class sets up teh signup form to allow potential - users to sign up.
*/
class Signup extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="form-signup">
          <h2>Sign Up</h2>
          <h3>read and write from thousands of prompts.
              <div className="break"></div></h3>
          <fieldset>
              <p className="login-msg">Please include 5 cents for good luck.</p>
              <form action="/signup" method="POST">
                  <input type="email" name="email" placeholder="Email" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <input type="text" name="penname" placeholder="Pen Name" required />
                  <input type="submit" value="Sign up" />
              </form>
              <a className="loginSwitch" onClick={this.props.handleForm}> Already signed up? Log in.</a>
          </fieldset>
      </div>
  );
  }
}

/*
This class sets up the login form to allow existing users to log in.
*/
class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = { permission: false}
  }

  render(){
    return(
        <div className="form-login">
            <h1>Log in</h1>
            <fieldset>
                <form id="login-form" action="/login" method="POST">
                    <input type="email" name="email" placeholder="Enter your email address" required />
                    <input type="password" name="password" placeholder="Enter your password" required />
                    <br />
                    <input onClick={this.props.loginHandler} id="login-submit" type="submit" value="Log in" />
                </form>
                <a className="signupSwitch" onClick={this.props.handleForm}> Not signed up? Create an account.</a><br></br>
          </fieldset>
        </div>
    )

  }
}

/*DASHBOARD PAGE
===================================================================================
These functions create the front and back of the dashboard page. Used for personal user information.
===================================================================================


/*
This function creates the back side of the dashboard which shows all the stories that the
user enjoyed.
*/
class Back extends React.Component{
  constructor(){
    super();
    this.state = {result: []}
  }

  componentDidMount(){
   this.serverRequest = $.post("/getfavorites", function (result) {
     this.setState({ result :result});
   }.bind(this));
 }

   render(){
     var tab = [];
     for (var i = 0; i < this.state.result.length; i++){
       tab.push(<PromptsFront piece = {this.state.result[i].piece} prompt ={this.state.result[i].text}  promptid={this.state.result[i].prompt} date={this.state.result[i].date}/>)
     }
     return (
         <div className="dashboard_front">
             <div className="following">
                 <div className="rectangle">
                     <h1>
                         Stories I Liked
                     </h1>
                 </div>
                 <hr></hr>
             </div>
             <div className = "display_box_container">
                 {tab}
             </div>
         </div>
     )
   }
};


/*
//This function creates the front side of the dashboard that shows all teh stories they have written.
*/
class Front extends React.Component {
  constructor(){
    super();
    this.state = {result: []};
  }

  componentDidMount(){
   this.serverRequest = $.post("/getpieces", function (result) {
     this.setState({ result :result});
   }.bind(this));

  }

  render(){
    var tab = [];
    for (var i = 0; i < this.state.result.length; i++){
      tab.push(<PromptsFront  piece = {this.state.result[i].piece} prompt ={this.state.result[i].text}  promptid={this.state.result[i].prompt}  date={this.state.result[i].date} />)
    }
    if(this.state.result.length>0){
    return (
        <div className="dashboard_front">
            <div className="following">
                <div className="rectangle">
                    <h1>
                        Stories I Wrote
                    </h1>
                </div>
                <hr></hr>
            </div>
            <div >
                {tab}
            </div>
        </div>
    )
  }
  else{
    return (
        <div className="dashboard_front">
            <div className="following">
                <div className="rectangle">
                    <h1>
                        Stories I Wrote
                    </h1>
                </div>
                <hr></hr>
            </div>
            <div className = "display_box_container">
                <h1>You haven't written anything yet! Go to the writing page to get started!</h1>
            </div>
        </div>
    )

  }
}
};


/*
This class creates a promp response statistic. It has information such as likes,and date.
*/
class PromptsFront extends React.Component{
  constructor(props){
    super(props);
    this.text= props.prompt;
    this.tid = "div" + this.props.promptid
    this.state = {writing_prompt: "", result:[], votes:0}
}

  getDate(){
    return(this.props.date.substring(0,11))

  }
  componentDidMount(){
    var data= {
      pid:this.props.promptid,
      piece:this.props.piece
    }
    this.serverRequest = $.post("/findprompt", data=data, function (result) {
    this.setState({ writing_prompt : result});
    }.bind(this));
    this.serverRequest = $.post("/votetotal", data=data,function (votes){
      this.setState({votes:votes});
    }.bind(this));
    document.getElementById(this.tid).innerHTML = this.text;
  }
    render() {
      return(
      <div className="display_box">
          <div className = "feedback_header">
            <div className = "feedback_header_date">{this.getDate()}</div>
            <div className = "feedback_header_likes">&#9734; {this.state.votes}</div>
            </div>
          <h1><b>{this.state.writing_prompt}</b></h1>
          <div>
          <p id={this.tid} className="pText"><hr></hr></p>
          </div>
      </div>
      )
    }
}



/* WRITING PAGE
=================================================================================
These functions are all part of the writing page.
=================================================================================
*/



/*
This class creates a prompt object witha single writing prompt inside a box.
*/

class Prompts extends React.Component{
  constructor(props){
    super(props);
    this.prompt = props.prompt;
    this.state = { promptChoice: 0} ;
    this.handleChoice = this.handleChoice.bind(this);
  }

  handleChoice(){
    var text = $.post("/getprompts", function (response) {
      this.setState({ });
    });
  }

  render() {
    return(
      <div className="prompt_tab">
        <div onClick ={this.handleChoice} className="daily_box">
              <p>{this.prompt}</p>
        </div>
      </div>
    )
  }
}



/*
This class creates a set of prompts for the writing page.
*/
class PromptsWriting extends React.Component{
  constructor(props){
    super(props);
    this.state = {published:false}
  }

  setHighlight(){
    if(this.props.currentPID === this.props.pid){
     return(true);
    }
  }

  ispublished(){
   var data = {
     pid:this.props.pid,
   };
    this.serverRequest = $.post("/ispublished",data=data, function(result){
          if(result == "1"){
            this.setState({published:true});
          }
          else {
          }
    }.bind(this));
  }

 componentDidMount(){
   this.ispublished()
 }

  render() {
    if(this.state.published){
      return(
        <div>
          <div className="promptInfo" onClick= {this.props.clickHandler}>
            <div className="p-box-green">
              <p className="writing_page_prompts">
                {this.props.prompt}
              </p>
            </div>
          </div>
        </div>
      )
    }
    if(this.setHighlight()){
      return(
        <div>
          <div className="promptInfo" onClick= {this.props.clickHandler}>
            <div className="p-box-blue">
              <p className="writing_page_prompts">
                {this.props.prompt}
              </p>
            </div>
          </div>
        </div>

      )
    }
    else{
    return(
      <div>
        <div className="promptInfo" onClick= {this.props.clickHandler}>
          <div className="p-box">
            <p className="writing_page_prompts">
              {this.props.prompt}
            </p>
          </div>
        </div>
      </div>
    );
    }
  }
}

/*
This class creates the writing page. It has 7 prompts taken from writingPrompts class and
 has a field for typing a response
 */
class WritingPage extends React.Component{
  constructor(){
    super();
    this.state = { result: [], pid: [], currentPID: 1, currentPrompt: "Choose a prompt to write!", highlight: false};
    this.highlight = this.highlight.bind(this);

  }

  componentWillMount(){
   this.serverRequest = $.post("/getprompts", function (result) {
     this.setState({ result:result });
   }.bind(this));
  }


  setPID(pid, event){
    var text = IO.loadText(pid);
    IO.setAutoSave(pid);
    this.setState({currentPID: pid});
  }

  setPrompt(prompt, event){
    this.setState({currentPrompt: prompt});
  }

  highlight(highlight,event){
    this.setState({highlight: false})
  }

  clickHandler(highlight,pid,prompt,event){
    this.setPID(pid,event);
    this.setPrompt(prompt,event);
    this.highlight(highlight,event);
  }

  render(){
    var tab = [];
    var writingArea = null;
    for (var i = 0; i < this.state.result.length; i++){
      tab.push(<PromptsWriting
        clickHandler={this.clickHandler.bind(this,this.state.highlight,this.state.result[i].pid,this.state.result[i].text)}
        prompt={this.state.result[i].text}
        pid={this.state.result[i].pid}
        currentPID = {this.state.currentPID}
        highlight={this.state.highlight}
        />)};
    return(
        <div>
            <div className="selectionBox">
                {tab}
            </div>
             <WritingArea pid={this.state.currentPID} prompt={this.state.currentPrompt}/>
        </div>
      )
  }
}

/*
This is the typing area for the writing page.
*/
class WritingArea extends React.Component {
    constructor(props) {
        super(props);
        this.pid = props.pid;
        this.state = {pid: props.pid}
    }
      componentWillMount(){
       pubButton();
      }

    publish(){
      IO.publishText(this.props.pid);
    }

    render() {
      if(this.props.pid == 0){
        return(
            <div>
                <div className="writing_head">
                    <h1 className="no-prompt">{this.props.prompt}</h1>
                </div>
              </div>
            )
          }
          else{
            return(
            <div>
                <div className="writing_head">
                    <button id="publish-button" onClick={this.publish.bind(this)} className="btn submit">Submit</button>
                    <h1>{this.props.prompt}</h1>
                <div className="words">WordCount:</div>
                </div>
                <section className="writingpage_section">
                    <article id="text" contentEditable="true" className="content writingpage_article"></article>
                </section>
              </div>
            )

            }
    }
}

/* READING page
==============================================================================================
The functions below are all part of the Reading page.
==============================================================================================
*/

class ReadingPage extends React.Component{
  constructor(){
    super();
    this.state = {currentAuthor: " ", prompts: [], currentPromptID: 0, currentPID: 1, pieceID:-1, like: 0, showCommentBox:0, comments: []};
  }

  componentWillMount(){
   this.serverRequest = $.post("/getprompts", function (result) {
     this.setState({ prompts: result });
   }.bind(this));
  }

  componentWillUnmount() {
    IO.clearLoad();
  }

  toggleComment(event){
    if(this.state.showCommentBox === 0) {
        this.setState({ showCommentBox: 1 })
        var data = {
            piece_id: this.state.pieceID
        };
        $.post('/comment',data=data, (response) => {
            this.setState({ comments: response })
        })
    } else {
        this.setState({ showCommentBox: 0 })
    }
  }
  toggleLike(event) {
    var data = {
      piece_id: this.state.pieceID,
    };
    $.post('/vote',data=data, (response) => {
      this.setState({like: response["like"]})
    })

  }

  setPID(pid, event){
    $('#text').text(" ");
    var data = {
      prompt_id: pid,
    };
    $.post('/loadrandom', data=data, (response) => {
          $('#text').text(response["text"]);
          this.setState({pieceID: response["piece_id"]})
          this.setState({like: response["like"]})
          this.getAuthor();
        }
      )
    this.setState({currentPromptID: pid});
    this.state.showCommentBox = 1;
    this.toggleComment();
  }

  setPrompt(prompt, event){
    this.setState({currentPrompt: prompt});
  }

  clickHandler(pid,prompt,event){
    this.setPID(pid, event);
    this.setPrompt(prompt,event);
  }

  getAuthor(event){
    if(this.state.pieceID != null){
    var data = {
      piece_id:this.state.pieceID,
    };
    $.post('/getauthor',data=data,(response) => {
      this.setState({currentAuthor: response["author"]})
    })
    }
    else{
      this.setState({currentAuthor: " "})
    }
  }


  render(){
    var tab = [];
    var writingArea = null;
    for (var i = 0; i < this.state.prompts.length; i++){
      tab.push(<PromptsReading
          clickHandler={this.clickHandler.bind(this, this.state.prompts[i].pid, this.state.prompts[i].text)}
          currentPID={this.state.currentPromptID}
          prompt={this.state.prompts[i].text}
          pid={this.state.prompts[i].pid}
          pieceID={this.state.pieceID}/>)
    }
    return(
        <div>
            <div className="selectionBox">
                {tab}

            </div>
            <ReadingArea author={this.state.currentAuthor} pid={this.state.currentPromptID} prompt={this.state.currentPrompt}/>
            <div class="cover-comments">
              <div id="rct">
                <Feedback
                    pieceID={this.state.pieceID}
                    upComment={this.toggleComment.bind(this)}
                    onClick={this.toggleLike.bind(this)}
                    likeState={this.state.like}
                    comments={this.state.comments}
                    showCommentBox={this.state.showCommentBox}
                />
              </div>
            </div>
        </div>

    )
  }
}

/*
This class creates a set of prompts for the writing page.
*/
class PromptsReading extends React.Component{
  constructor(props){
    super(props);
    this.state = {published:false}
  }

  setHighlight(){
    if(this.props.currentPID === this.props.pid){
     return(true);
    }
  }


  render() {
    if(this.setHighlight()){
      return(
        <div>
          <div className="promptInfo" onClick= {this.props.clickHandler}>
            <div className="p-box-blue">
              <p className="writing_page_prompts">
                {this.props.prompt}
              </p>
            </div>
          </div>
        </div>

      )
    }
    else{
    return(
      <div>
        <div className="promptInfo" onClick= {this.props.clickHandler}>
          <div className="p-box">
            <p className="writing_page_prompts">
              {this.props.prompt}
            </p>
          </div>
        </div>
      </div>
    );
    }
  }
}


class ReadingArea extends React.Component {

    constructor(props) {
        super(props);
        this.pid = props.pid;
        this.state = {pid: props.pid, currentAuthor:" "}
    }

    render() {
        return (
            <div>
              <div className="reading_head">
                  <h1>{this.props.prompt}</h1>
                  <p> Author: {this.props.author}</p>
                </div>
                <section className="writingpage_section">
                    <article id="text" contentEditable="false" className="content writingpage_article"></article>
                </section>
              </div>
        )
    }
}


class CommentBox extends React.Component {
    constructor(props){
      super(props);
      this.state = {comments: []};
      this.handleCommentSubmit = this.handleCommentSubmit.bind(this)
    }

    handleCommentSubmit(text,pieceID, event){
      var data = {
        text:text,
        pieceID:pieceID,
      };
      $.post('/newcomment',data=data,function(comment){
      }.bind(this));
      this.props.upComment();
    }

    render(){
    return(
      <div className = "commentBox">
      <CommentList comments={this.props.comments} />
      <CommentForm onCommentSubmit={this.handleCommentSubmit} pieceID={this.props.pieceID} />
      </div>
    );
  }

  }

  class CommentForm extends React.Component{
    constructor(props){
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(){
      var text = this.refs.text.value.trim();
      if (!text) {
      return;
      }
      this.props.onCommentSubmit(text,this.props.pieceID);
      this.refs.text.value = '';
      return;
    }

    render(){
        comSubmit();
      return(
        <form  id="comment_submit" className="commentForm" onSubmit={this.handleSubmit}>
        <textarea type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" className = "commentSubmit"/>
        </form>
      )
    }
  }

  class CommentList extends React.Component{
    // Comment aggregation [(author, text)]
      constructor(props) {
      super(props);
    }

    render(){
      var commentNodes = this.props.comments.map(function(comment){
        return(
          <Comment author={comment.name} text={comment.comment}> </Comment>
        );
      });
      return(
        <div className="commentList">
        {commentNodes}
        </div>
      );
    }
  }

  //var data= [ {id: 1, author: "Pete Hunt", text: "This is one comment"},{id: 2, author: "Jordan Walke", text: "This is *another* comment"}];

  class Comment extends React.Component{
      constructor(props){
      super(props);
    }

    render(){
      return(
        <div className="comment">
        <h2 className="commentAuthor">
          <b>{this.props.author}</b>
          </h2>
        <h2 className= "commentText">
          {this.props.text}
          </h2>
        </div>
      )
    }
  }

  class Feedback extends React.Component {
    constructor(props) {
        super(props);
    }

    comments() {
        if(this.props.showCommentBox === 1) {
          return(
                <div>
                    <CommentBox upComment={this.props.upComment} comments={this.props.comments} pieceID= {this.props.pieceID}/>
                </div>)
        }
        return(<div></div>)
    }

     render() {
        const textLike = this.props.likeState ? 'Unlike' : 'Like';
        const textComment = "Comments";
        return (
            <div>
                <div className="rct-1">
                    <div onClick={this.props.onClick} className="like">
                        {textLike}
                    </div>
                    <div onClick={this.props.upComment} className="comment-opening">
                        {textComment}
                    </div>
                </div>
                {this.comments()}
            </div>
        );
    }
}

//
//ReactDOM.render(<Writing/>, document.getElementById('writing_page'));
//ReactDOM.render(<Story/>,document.getElementById('story'))
window.onload = function(){
  var url = window.location.href.split('/');
  if(inArray("dashboard",url)){
    ReactDOM.render(<Story/>, document.getElementById('d_board'));
  }
  else if(inArray("writing",url)){
    ReactDOM.render(<WritingPage/>, document.getElementById('writing_page'));
  }
  else if(inArray("reading",url)){
    comSubmit();
    ReactDOM.render(<ReadingPage/>, document.getElementById('reading-page'));

  }
  else if(inArray("",url)){
    ReactDOM.render(<Landing/>, document.getElementById('landing-page'));
  }
};
