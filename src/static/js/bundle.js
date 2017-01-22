/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* UTILITIES */

	var inArray = function (element, array) {
	  for (var i = array.length - 1; i < array.length; i++) {
	    if (element.localeCompare(array[i]) === 0) {
	      return true;
	    } else {
	      return false;
	    }
	  }
	};

	var conSubmit = function () {
	  $('#comment_submit').submit(function (e) {
	    e.preventDefault();
	    return false;
	  });

	  $('#signupForm').submit(function (e) {
	    e.preventDefault();
	    return false;
	  });
	};

	var pubButton = function () {
	  $("#publish-button").click(function () {
	    document.getElementById("publish-button").className = 'btn submitted';
	  });
	};

	var check = function () {
	  unObject = null;
	  pnObject = null;

	  var validate = function () {
	    console.log("test");
	    validateEmail();
	    validatePenname();
	  };

	  var validateEmail = function () {
	    var data = {
	      email: document.myform.email.value
	    };
	    unObject = $.post('/checkUN', data = data, function (response, status_code, xhr) {
	      if (response === 'SUCCESS') {
	        document.getElementById('emailError').innerHTML = "";
	      } else {
	        document.getElementById('emailError').innerHTML = "Email has been used";
	        $('#signupForm').submit(function (e) {
	          e.preventDefault();
	          console.log("test2");
	          return false;
	        });
	      }
	    });
	  };

	  var validatePenname = function () {
	    var data = {
	      penname: document.myform.penname.value
	    };
	    pnObject = $.post('/checkPN', data = data, function (response, status_code, xhr) {
	      if (response === 'SUCCESS') {
	        document.getElementById('pennameError').innerHTML = "";
	      } else {
	        document.getElementById('pennameError').innerHTML = "Penname has been taken";
	        $('#signupForm').submit(function (e) {
	          e.preventDefault();
	          return false;
	          console.log("test2");
	        });
	      }
	    });
	  };

	  return {
	    validate: validate,
	    validatePenname: validatePenname,
	    validateEmail: validateEmail
	  };
	}();

	var IO = function () {
	  SAVE_INTERVAL = 500;
	  autoSave = null; // Save Timeout object
	  saveObject = null; // Save request object
	  loadObject = null; // Load request object
	  voteObject = null; // Vote
	  commentObject = null;

	  var NewPrompt = function () {
	    var init = new Date(2012, 11, 29);
	    var now = Date.now();
	    var diff = now - initialDate;
	    var timeMili = 24 * 60 * 60 * 1000;
	    var daysSince = Math.floor(difference / timeMili);
	    return daysSince;
	  };

	  var loginHandler = function () {
	    var data = {};
	    var inputs = $('#login-form :input');
	    $('#login-submit').each(function (e) {
	      data[e.name] = e.value;
	    });
	  };

	  var saveText = function (pid) {

	    var doc = document.querySelector('#text');
	    var text = doc.innerHTML;
	    var data = {
	      prompt_id: pid,
	      //text: $('#text').text(),
	      text: text
	    };
	    if (saveObject) {
	      saveObject.abort();
	      saveObject = null;
	    }
	    saveObject = $.post('/save', data = data, function (response, status_code, xhr) {
	      if (response === 'SUCCESS') {
	        onsubmit;
	      } else {
	        console.log("Save failed.");
	      }
	    });
	  };

	  var publishText = function (pid) {
	    var data = {
	      prompt_id: pid
	    };
	    $.post('/publish', data = data, function (response, status_code, xhr) {
	      if (response === 'SUCCESS') {} else {
	        saveText(pid);
	        console.log("Published failed");
	      }
	    });
	  };

	  var loadText = function (pid) {
	    var retText = "";
	    var data = {
	      prompt_id: pid
	    };
	    $.post('/load', data = data, function (text, status_code, xhr) {
	      if (status_code === 'success') {
	        $('#text').html(text);
	        wordCount();
	      } else {
	        console.log('load fail');
	      }
	    });
	  };

	  var loadFrontText = function (pid) {
	    var retText = "";
	    var data = {
	      prompt_id: pid
	    };
	    $.post('/load', data = data, function (text, status_code, xhr) {
	      if (status_code === 'success') {
	        $('#promptText').html(text);
	      } else {
	        console.log('load fail');
	      }
	    });
	  };

	  var loadRandomText = function (pid) {
	    var data = {
	      prompt_id: pid
	    };
	    if (loadObject) {
	      loadObject.abort();
	      loadObject = null;
	    }
	    loadObject = $.post('/loadrandom', data = data, function (response, status_code, xhr) {
	      if (status_code === 'success') {
	        $('#text').text(response["text"]);
	      } else {}
	    });
	    return piece_id;
	  };

	  var setAutoSave = function (pid) {
	    $("#text").on("input propertychange change keyup input paste", function (e) {
	      clearTimeout(autoSave);
	      autoSave = setTimeout(function () {
	        saveText(pid);
	      }, SAVE_INTERVAL);
	    });
	  };

	  var wordCount = function (pid) {
	    $("#text").on("input propertychange change keyup input paste", function (e) {
	      var text = this.textContent,
	          count = text.trim().replace(/\s+/g, ' ').split(' ').length;
	      document.querySelector('.words').textContent = "WordCount: " + count;
	    });
	    var text = document.querySelector('#text').textContent;
	    count = text.trim().replace(/\s+/g, ' ').split(' ').length;
	    if (count == 1) {
	      count = 0;
	    }
	    document.querySelector('.words').textContent = "WordCount: " + count;
	  };

	  var clearLoad = function () {
	    loadObject.abort();
	    loadObject = null;
	  };

	  var vote = function (piece_id) {
	    var data = { piece_id: piece_id };
	    voteObject = $.post('/vote', data = data, function (response, status_code, xhr) {
	      if (status_code === "success") {
	        return true;
	      } else {
	        return false;
	      }
	    });
	    return voteObject;
	  };

	  var comment = function (text, pieceID) {
	    var data = {
	      text: text,
	      pieceID: pieceID
	    };
	    commentObject = $.post('/comment', data = data, function (response, status_code, xhr) {
	      if (status_code === "success") {} else {
	        console.log("comment fail");
	      }
	    });
	    return commentObject;
	  };

	  return {
	    saveText: saveText,
	    loadText: loadText,
	    loadFrontText: loadFrontText,
	    loadRandomText: loadRandomText,
	    setAutoSave: setAutoSave,
	    publishText: publishText,
	    loginHandler: loginHandler,
	    clearLoad: clearLoad,
	    vote: vote,
	    comment: comment,
	    wordCount: wordCount
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
	    this.logout = this.logout.bind(this);
	  }

	  handleDisplay() {
	    this.setState({
	      favorites: !this.state.favorites
	    });
	  }

	  logout() {
	    this.serverRequest = $.post("/logout", function (result) {}.bind(this));
	  }

	  dailyTop(number) {
	    if (number == 0) {
	      return React.createElement(Back, null);
	    } else if (number == 1) {
	      return React.createElement(Front, null);
	    }
	  }

	  render() {
	    const textStory = this.state.favorites ? 'Go to My Writing' : 'Go to My Favorites';
	    var mode = this.state.favorites ? 0 : 1;
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 's-tog' },
	        React.createElement(
	          'div',
	          { className: 'black_box', onClick: this.handleDisplay },
	          React.createElement(
	            'h1',
	            null,
	            textStory
	          )
	        ),
	        this.dailyTop(mode)
	      )
	    );
	  }
	};

	//This function creates the class that renders the template for "reading.html"
	class Entry extends React.Component {
	  constructor() {
	    super();
	  }
	  render() {
	    var { title, pic, author, date, text } = this.props;
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'h1',
	        { className: 'story_title' },
	        title
	      ),
	      React.createElement(
	        'div',
	        { className: 'profile-box' },
	        React.createElement('img', { className: 'author_pic img-circular', src: pic, height: 24 }),
	        React.createElement(
	          'div',
	          { className: 'author_info' },
	          React.createElement(
	            'h1',
	            { className: 'author_name' },
	            author
	          ),
	          React.createElement(
	            'h1',
	            { className: 'date' },
	            date
	          )
	        )
	      ),
	      React.createElement(
	        'p',
	        { className: 'story_text' },
	        text
	      )
	    );
	  }
	};
	Entry.propTypes = {
	  title: React.PropTypes.string.isRequired // Makes Title a property
	};
	Entry.defaultProps = { // initialize title
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
	class Landing extends React.Component {
	  constructor() {
	    super();
	    this.state = { signupLogin: 1 };
	    this.handleForm = this.handleForm.bind(this);
	  }

	  handleForm(signupLogin, event) {
	    this.setState({ signupLogin: !this.state.signupLogin });
	  }

	  loginHandler(event) {
	    var response = IO.loginHandler();
	  }

	  checkForm(signupLogin) {
	    if (signupLogin == 1) {
	      return React.createElement(Signup, { loginHandler: this.loginHandler.bind(this), handleForm: this.handleForm.bind(this, this.state.signupLogin) });
	    } else {
	      return React.createElement(Login, { handleForm: this.handleForm.bind(this, this.state.signupLogin) });
	    }
	  }

	  render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'form-container' },
	        React.createElement(
	          'h1',
	          null,
	          'BardHop'
	        ),
	        React.createElement(
	          'div',
	          { id: 'login' },
	          this.checkForm(this.state.signupLogin)
	        ),
	        React.createElement('div', { className: 'intro' })
	      )
	    );
	  }
	}

	/*
	This class sets up teh signup form to allow potential - users to sign up.
	*/
	class Signup extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    return React.createElement(
	      'div',
	      { className: 'form-signup' },
	      React.createElement(
	        'h2',
	        null,
	        'Sign Up'
	      ),
	      React.createElement(
	        'h3',
	        null,
	        'read and write from thousands of prompts.',
	        React.createElement('div', { className: 'break' })
	      ),
	      React.createElement('h3', { id: 'emailError' }),
	      React.createElement('h3', { id: 'pennameError' }),
	      React.createElement(
	        'fieldset',
	        null,
	        React.createElement(
	          'p',
	          { className: 'login-msg' },
	          'Please include 5 cents for good luck.'
	        ),
	        React.createElement(
	          'form',
	          { name: 'myform', id: 'signupForm', action: '/signup', method: 'POST', onSubmit: check.validate },
	          React.createElement('input', { type: 'email', name: 'email', placeholder: 'Email', required: true }),
	          React.createElement('input', { type: 'password', name: 'password', placeholder: 'Password', required: true }),
	          React.createElement('input', { type: 'text', name: 'penname', placeholder: 'Pen Name', required: true }),
	          React.createElement('input', { type: 'submit', value: 'Sign up' })
	        ),
	        React.createElement(
	          'a',
	          { className: 'loginSwitch', onClick: this.props.handleForm },
	          ' Already signed up? Log in.'
	        )
	      )
	    );
	  }
	}

	/*
	This class sets up the login form to allow existing users to log in.
	*/
	class Login extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = { permission: false };
	  }

	  render() {
	    return React.createElement(
	      'div',
	      { className: 'form-login' },
	      React.createElement(
	        'h1',
	        null,
	        'Log in'
	      ),
	      React.createElement(
	        'fieldset',
	        null,
	        React.createElement(
	          'form',
	          { id: 'login-form', action: '/login', method: 'POST' },
	          React.createElement('input', { type: 'email', name: 'email', placeholder: 'Enter your email address', required: true }),
	          React.createElement('input', { type: 'password', name: 'password', placeholder: 'Enter your password', required: true }),
	          React.createElement('br', null),
	          React.createElement('input', { onClick: this.props.loginHandler, id: 'login-submit', type: 'submit', value: 'Log in' })
	        ),
	        React.createElement(
	          'a',
	          { className: 'signupSwitch', onClick: this.props.handleForm },
	          ' Not signed up? Create an account.'
	        ),
	        React.createElement('br', null)
	      )
	    );
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
	class Back extends React.Component {
	  constructor() {
	    super();
	    this.state = { result: [] };
	  }

	  componentDidMount() {
	    this.serverRequest = $.post("/getfavorites", function (result) {
	      this.setState({ result: result });
	    }.bind(this));
	  }

	  render() {
	    var tab = [];
	    for (var i = 0; i < this.state.result.length; i++) {
	      tab.push(React.createElement(PromptsFront, { piece: this.state.result[i].piece, prompt: this.state.result[i].text, promptid: this.state.result[i].prompt, date: this.state.result[i].date }));
	    }
	    return React.createElement(
	      'div',
	      { className: 'dashboard_front' },
	      React.createElement(
	        'div',
	        { className: 'following' },
	        React.createElement(
	          'div',
	          { className: 'rectangle' },
	          React.createElement(
	            'h1',
	            null,
	            'Stories I Liked'
	          )
	        ),
	        React.createElement('hr', null)
	      ),
	      React.createElement(
	        'div',
	        { className: 'display_box_container' },
	        tab
	      )
	    );
	  }
	};

	/*
	//This function creates the front side of the dashboard that shows all teh stories they have written.
	*/
	class Front extends React.Component {
	  constructor() {
	    super();
	    this.state = { result: [] };
	  }

	  componentDidMount() {
	    this.serverRequest = $.post("/getpieces", function (result) {
	      this.setState({ result: result });
	    }.bind(this));
	  }

	  render() {
	    var tab = [];
	    for (var i = 0; i < this.state.result.length; i++) {
	      tab.push(React.createElement(PromptsFront, { piece: this.state.result[i].piece, prompt: this.state.result[i].text, promptid: this.state.result[i].prompt, date: this.state.result[i].date }));
	    }
	    if (this.state.result.length > 0) {
	      return React.createElement(
	        'div',
	        { className: 'dashboard_front' },
	        React.createElement(
	          'div',
	          { className: 'following' },
	          React.createElement(
	            'div',
	            { className: 'rectangle' },
	            React.createElement(
	              'h1',
	              null,
	              'Stories I Wrote'
	            )
	          ),
	          React.createElement('hr', null)
	        ),
	        React.createElement(
	          'div',
	          null,
	          tab
	        )
	      );
	    } else {
	      return React.createElement(
	        'div',
	        { className: 'dashboard_front' },
	        React.createElement(
	          'div',
	          { className: 'following' },
	          React.createElement(
	            'div',
	            { className: 'rectangle' },
	            React.createElement(
	              'h1',
	              null,
	              'Stories I Wrote'
	            )
	          ),
	          React.createElement('hr', null)
	        ),
	        React.createElement(
	          'div',
	          { className: 'display_box_container' },
	          React.createElement(
	            'h1',
	            null,
	            'You haven\'t written anything yet! Go to the writing page to get started!'
	          )
	        )
	      );
	    }
	  }
	};

	/*
	This class creates a promp response statistic. It has information such as likes,and date.
	*/
	class PromptsFront extends React.Component {
	  constructor(props) {
	    super(props);
	    this.text = props.prompt;
	    this.tid = "div" + this.props.promptid;
	    this.state = { writing_prompt: "", result: [], votes: 0 };
	  }

	  getDate() {
	    return this.props.date.substring(0, 11);
	  }
	  componentDidMount() {
	    var data = {
	      pid: this.props.promptid,
	      piece: this.props.piece
	    };
	    this.serverRequest = $.post("/findprompt", data = data, function (result) {
	      this.setState({ writing_prompt: result });
	    }.bind(this));
	    this.serverRequest = $.post("/votetotal", data = data, function (votes) {
	      this.setState({ votes: votes });
	    }.bind(this));
	    document.getElementById(this.tid).innerHTML = this.text;
	  }
	  render() {
	    return React.createElement(
	      'div',
	      { className: 'display_box' },
	      React.createElement(
	        'div',
	        { className: 'feedback_header' },
	        React.createElement(
	          'div',
	          { className: 'feedback_header_date' },
	          this.getDate()
	        ),
	        React.createElement(
	          'div',
	          { className: 'feedback_header_likes' },
	          '☆ ',
	          this.state.votes
	        )
	      ),
	      React.createElement(
	        'h1',
	        null,
	        React.createElement(
	          'b',
	          null,
	          this.state.writing_prompt
	        )
	      ),
	      React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'p',
	          { id: this.tid, className: 'pText' },
	          React.createElement('hr', null)
	        )
	      )
	    );
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

	class Prompts extends React.Component {
	  constructor(props) {
	    super(props);
	    this.prompt = props.prompt;
	    this.state = { promptChoice: 0 };
	    this.handleChoice = this.handleChoice.bind(this);
	  }

	  handleChoice() {
	    var text = $.post("/getprompts", function (response) {
	      this.setState({});
	    });
	  }

	  render() {
	    return React.createElement(
	      'div',
	      { className: 'prompt_tab' },
	      React.createElement(
	        'div',
	        { onClick: this.handleChoice, className: 'daily_box' },
	        React.createElement(
	          'p',
	          null,
	          this.prompt
	        )
	      )
	    );
	  }
	}

	/*
	This class creates a set of prompts for the writing page.
	*/
	class PromptsWriting extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = { published: false };
	  }

	  setHighlight() {
	    if (this.props.currentPID === this.props.pid) {
	      return true;
	    }
	  }

	  ispublished() {
	    var data = {
	      pid: this.props.pid
	    };
	    this.serverRequest = $.post("/ispublished", data = data, function (result) {
	      if (result == "1") {
	        this.setState({ published: true });
	      } else {}
	    }.bind(this));
	  }

	  componentDidMount() {
	    this.ispublished();
	  }

	  render() {
	    if (this.state.published) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'promptInfo', onClick: this.props.clickHandler },
	          React.createElement(
	            'div',
	            { className: 'p-box-green' },
	            React.createElement(
	              'p',
	              { className: 'writing_page_prompts' },
	              this.props.prompt
	            )
	          )
	        )
	      );
	    }
	    if (this.setHighlight()) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'promptInfo', onClick: this.props.clickHandler },
	          React.createElement(
	            'div',
	            { className: 'p-box-blue' },
	            React.createElement(
	              'p',
	              { className: 'writing_page_prompts' },
	              this.props.prompt
	            )
	          )
	        )
	      );
	    } else {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'promptInfo', onClick: this.props.clickHandler },
	          React.createElement(
	            'div',
	            { className: 'p-box' },
	            React.createElement(
	              'p',
	              { className: 'writing_page_prompts' },
	              this.props.prompt
	            )
	          )
	        )
	      );
	    }
	  }
	}

	/*
	This class creates the writing page. It has 7 prompts taken from writingPrompts class and
	 has a field for typing a response
	 */
	class WritingPage extends React.Component {
	  constructor() {
	    super();
	    this.state = { result: [], pid: [], currentPID: 1, currentPrompt: "Choose a prompt to write!", highlight: false };
	    this.highlight = this.highlight.bind(this);
	  }

	  componentWillMount() {
	    this.serverRequest = $.post("/getprompts", function (result) {
	      this.setState({ result: result });
	    }.bind(this));
	  }

	  setPID(pid, event) {
	    var text = IO.loadText(pid);
	    IO.setAutoSave(pid);
	    this.setState({ currentPID: pid });
	  }

	  setPrompt(prompt, event) {
	    this.setState({ currentPrompt: prompt });
	  }

	  highlight(highlight, event) {
	    this.setState({ highlight: false });
	  }

	  clickHandler(highlight, pid, prompt, event) {
	    this.setPID(pid, event);
	    this.setPrompt(prompt, event);
	    this.highlight(highlight, event);
	  }

	  render() {
	    var tab = [];
	    var writingArea = null;
	    for (var i = 0; i < this.state.result.length; i++) {
	      tab.push(React.createElement(PromptsWriting, {
	        clickHandler: this.clickHandler.bind(this, this.state.highlight, this.state.result[i].pid, this.state.result[i].text),
	        prompt: this.state.result[i].text,
	        pid: this.state.result[i].pid,
	        currentPID: this.state.currentPID,
	        highlight: this.state.highlight
	      }));
	    };
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'selectionBox' },
	        tab
	      ),
	      React.createElement(WritingArea, { pid: this.state.currentPID, prompt: this.state.currentPrompt })
	    );
	  }
	}

	/*
	This is the typing area for the writing page.
	*/
	class WritingArea extends React.Component {
	  constructor(props) {
	    super(props);
	    this.pid = props.pid;
	    this.state = { pid: props.pid };
	  }
	  componentWillMount() {
	    pubButton();
	  }

	  publish() {
	    IO.publishText(this.props.pid);
	  }

	  render() {
	    if (this.props.pid == 0) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'writing_head' },
	          React.createElement(
	            'h1',
	            { className: 'no-prompt' },
	            this.props.prompt
	          )
	        )
	      );
	    } else {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'writing_head' },
	          React.createElement(
	            'button',
	            { id: 'publish-button', onClick: this.publish.bind(this), className: 'btn submit' },
	            'Submit'
	          ),
	          React.createElement(
	            'h1',
	            null,
	            this.props.prompt
	          ),
	          React.createElement(
	            'div',
	            { className: 'words' },
	            'WordCount:'
	          )
	        ),
	        React.createElement(
	          'section',
	          { className: 'writingpage_section' },
	          React.createElement('article', { id: 'text', contentEditable: 'true', className: 'content writingpage_article' })
	        )
	      );
	    }
	  }
	}

	/* READING page
	==============================================================================================
	The functions below are all part of the Reading page.
	==============================================================================================
	*/

	class ReadingPage extends React.Component {
	  constructor() {
	    super();
	    this.state = { currentAuthor: " ", prompts: [], currentPromptID: 0, currentPID: 1, pieceID: -1, like: 0, showCommentBox: 0, comments: [] };
	  }

	  componentWillMount() {
	    this.serverRequest = $.post("/getprompts", function (result) {
	      this.setState({ prompts: result });
	    }.bind(this));
	  }

	  componentWillUnmount() {
	    IO.clearLoad();
	  }

	  toggleComment(event) {
	    if (this.state.showCommentBox === 0) {
	      this.setState({ showCommentBox: 1 });
	      var data = {
	        piece_id: this.state.pieceID
	      };
	      $.post('/comment', data = data, response => {
	        this.setState({ comments: response });
	      });
	    } else {
	      this.setState({ showCommentBox: 0 });
	    }
	  }
	  toggleLike(event) {
	    var data = {
	      piece_id: this.state.pieceID
	    };
	    $.post('/vote', data = data, response => {
	      this.setState({ like: response["like"] });
	    });
	  }

	  setPID(pid, event) {
	    $('#text').text(" ");
	    var data = {
	      prompt_id: pid
	    };
	    $.post('/loadrandom', data = data, response => {
	      $('#text').text(response["text"]);
	      this.setState({ pieceID: response["piece_id"] });
	      this.setState({ like: response["like"] });
	      this.getAuthor();
	    });
	    this.setState({ currentPromptID: pid });
	    this.state.showCommentBox = 1;
	    this.toggleComment();
	  }

	  setPrompt(prompt, event) {
	    this.setState({ currentPrompt: prompt });
	  }

	  clickHandler(pid, prompt, event) {
	    this.setPID(pid, event);
	    this.setPrompt(prompt, event);
	  }

	  getAuthor(event) {
	    if (this.state.pieceID != null) {
	      var data = {
	        piece_id: this.state.pieceID
	      };
	      $.post('/getauthor', data = data, response => {
	        this.setState({ currentAuthor: response["author"] });
	      });
	    } else {
	      this.setState({ currentAuthor: " " });
	    }
	  }

	  render() {
	    var tab = [];
	    var writingArea = null;
	    for (var i = 0; i < this.state.prompts.length; i++) {
	      tab.push(React.createElement(PromptsReading, {
	        clickHandler: this.clickHandler.bind(this, this.state.prompts[i].pid, this.state.prompts[i].text),
	        currentPID: this.state.currentPromptID,
	        prompt: this.state.prompts[i].text,
	        pid: this.state.prompts[i].pid,
	        pieceID: this.state.pieceID }));
	    }
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'selectionBox' },
	        tab
	      ),
	      React.createElement(ReadingArea, { author: this.state.currentAuthor, pid: this.state.currentPromptID, prompt: this.state.currentPrompt }),
	      React.createElement(
	        'div',
	        { 'class': 'cover-comments' },
	        React.createElement(
	          'div',
	          { id: 'rct' },
	          React.createElement(Feedback, {
	            pieceID: this.state.pieceID,
	            upComment: this.toggleComment.bind(this),
	            onClick: this.toggleLike.bind(this),
	            likeState: this.state.like,
	            comments: this.state.comments,
	            showCommentBox: this.state.showCommentBox
	          })
	        )
	      )
	    );
	  }
	}

	/*
	This class creates a set of prompts for the writing page.
	*/
	class PromptsReading extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = { published: false };
	  }

	  setHighlight() {
	    if (this.props.currentPID === this.props.pid) {
	      return true;
	    }
	  }

	  render() {
	    if (this.setHighlight()) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'promptInfo', onClick: this.props.clickHandler },
	          React.createElement(
	            'div',
	            { className: 'p-box-blue' },
	            React.createElement(
	              'p',
	              { className: 'writing_page_prompts' },
	              this.props.prompt
	            )
	          )
	        )
	      );
	    } else {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'promptInfo', onClick: this.props.clickHandler },
	          React.createElement(
	            'div',
	            { className: 'p-box' },
	            React.createElement(
	              'p',
	              { className: 'writing_page_prompts' },
	              this.props.prompt
	            )
	          )
	        )
	      );
	    }
	  }
	}

	class ReadingArea extends React.Component {

	  constructor(props) {
	    super(props);
	    this.pid = props.pid;
	    this.state = { pid: props.pid, currentAuthor: " " };
	  }

	  render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'reading_head' },
	        React.createElement(
	          'h1',
	          null,
	          this.props.prompt
	        ),
	        React.createElement(
	          'p',
	          null,
	          ' Author: ',
	          this.props.author
	        )
	      ),
	      React.createElement(
	        'section',
	        { className: 'writingpage_section' },
	        React.createElement('article', { id: 'text', contentEditable: 'false', className: 'content writingpage_article' })
	      )
	    );
	  }
	}

	class CommentBox extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = { comments: [] };
	    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
	  }

	  handleCommentSubmit(text, pieceID, event) {
	    var data = {
	      text: text,
	      pieceID: pieceID
	    };
	    $.post('/newcomment', data = data, function (comment) {}.bind(this));
	    this.props.upComment();
	    this.props.upComment();
	  }

	  render() {
	    return React.createElement(
	      'div',
	      { className: 'commentBox' },
	      React.createElement(CommentList, { comments: this.props.comments }),
	      React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit, pieceID: this.props.pieceID })
	    );
	  }

	}

	class CommentForm extends React.Component {
	  constructor(props) {
	    super(props);
	    this.handleSubmit = this.handleSubmit.bind(this);
	  }

	  handleSubmit() {
	    var text = this.refs.text.value.trim();
	    if (!text) {
	      return;
	    }
	    this.props.onCommentSubmit(text, this.props.pieceID);
	    this.refs.text.value = '';
	    return;
	  }

	  render() {
	    comSubmit();
	    return React.createElement(
	      'form',
	      { id: 'comment_submit', className: 'commentForm', onSubmit: this.handleSubmit },
	      React.createElement('textarea', { type: 'text', placeholder: 'Say something...', ref: 'text' }),
	      React.createElement('input', { type: 'submit', value: 'Post', className: 'commentSubmit' })
	    );
	  }
	}

	class CommentList extends React.Component {
	  // Comment aggregation [(author, text)]
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    var commentNodes = this.props.comments.map(function (comment) {
	      return React.createElement(
	        Comment,
	        { author: comment.name, text: comment.comment },
	        ' '
	      );
	    });
	    return React.createElement(
	      'div',
	      { className: 'commentList' },
	      commentNodes
	    );
	  }
	}

	//var data= [ {id: 1, author: "Pete Hunt", text: "This is one comment"},{id: 2, author: "Jordan Walke", text: "This is *another* comment"}];

	class Comment extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  render() {
	    return React.createElement(
	      'div',
	      { className: 'comment' },
	      React.createElement(
	        'h2',
	        { className: 'commentAuthor' },
	        React.createElement(
	          'b',
	          null,
	          this.props.author
	        )
	      ),
	      React.createElement(
	        'h2',
	        { className: 'commentText' },
	        this.props.text
	      )
	    );
	  }
	}

	class Feedback extends React.Component {
	  constructor(props) {
	    super(props);
	  }

	  comments() {
	    if (this.props.showCommentBox === 1) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(CommentBox, { upComment: this.props.upComment, comments: this.props.comments, pieceID: this.props.pieceID })
	      );
	    }
	    return React.createElement('div', null);
	  }

	  render() {
	    const textLike = this.props.likeState ? 'Unlike' : 'Like';
	    const textComment = "Comments";
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { className: 'rct-1' },
	        React.createElement(
	          'div',
	          { onClick: this.props.onClick, className: 'like' },
	          textLike
	        ),
	        React.createElement(
	          'div',
	          { onClick: this.props.upComment, className: 'comment-opening' },
	          textComment
	        )
	      ),
	      this.comments()
	    );
	  }
	}

	//
	//ReactDOM.render(<Writing/>, document.getElementById('writing_page'));
	//ReactDOM.render(<Story/>,document.getElementById('story'))
	window.onload = function () {
	  var url = window.location.href.split('/');
	  if (inArray("dashboard", url)) {
	    ReactDOM.render(React.createElement(Story, null), document.getElementById('d_board'));
	  } else if (inArray("writing", url)) {
	    ReactDOM.render(React.createElement(WritingPage, null), document.getElementById('writing_page'));
	  } else if (inArray("reading", url)) {
	    ReactDOM.render(React.createElement(ReadingPage, null), document.getElementById('reading-page'));
	  } else if (inArray("", url)) {
	    ReactDOM.render(React.createElement(Landing, null), document.getElementById('landing-page'));
	  }
	};

/***/ }
/******/ ]);