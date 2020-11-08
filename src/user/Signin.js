import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Signin extends Component {
	
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			error: "",
			redirectToRefrer: false
		}
	}

	handleChange = name => event => {
		this.setState({error: ""});
		this.setState({ [name]: event.target.value});			//revise syntax
	};

	authenticate (jwt, next) {
		if(typeof window !== "undefined") {
			localStorage.setItem("jwt",JSON.stringify(jwt));
			next();
		}
	}

	clickSubmit = event => {
		event.preventDefault();
		const {email,password} = this.state;
		const user = {
			email,
			password
		};
		//console.log(user);
		this.signin(user).then(data => {
			if(data.error) {
				this.setState({ error: data.error });
			}	
			else{
				//authenticate user
				this.authenticate(data, () => {
					this.setState({redirectToRefrer: true})
				})
				//redirect
			} 

		});
	};

	signin = user => {
		return fetch("http://localhost:3000/signin", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		})
		.then(response => {
			return response.json()
		})
		.catch(err => console.log(err))
	};

	signinForm = (email,password) => (
		<form>
			<div className='form-group'>
				<label className='text-muted'>Email</label>
				<input onChange={this.handleChange('email')} type='email' className='form-control' value={email} />
			</div>
			<div className='form-group'>
				<label className='text-muted'>Password</label>
				<input onChange={this.handleChange('password')} type='password' className='form-control' value={password} />
			</div>
			<button onClick={this.clickSubmit} className='btn btn-raised btn-primary'>Submit</button>
		</form>
	)

	render() {
		const {email,password,error,redirectToRefrer} = this.state;

		if(redirectToRefrer){
			return <Redirect to="/" />
		}

		return (
			<div className='container'>
				<h2 className='mt-5 mb-5'>SignIn</h2>

				<div className="alert alert-primary" style={{display: error ? "" : 'none'}}>
					{error}
				</div>

				{this.signinForm(email,password)}
			</div>
		);
	}
}

export default Signin;