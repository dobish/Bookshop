import React, { Component } from 'react';

class Signup extends Component {
    state = {
        username: '',
        password: '',
        admin: false,
        message: ''
    }

    signup = () => {
        fetch('http://localhost:8080/signup', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                admin: this.state.admin
            })
        })
            .then(res => res.json())
            .then(r => {
                if(r.message == 'ok'){
                    this.setState({message: 'now you can log in'})
                }
            })
    }



    render() {
        return (
            <div>
                <input type="text" placeholder="username" onChange={e => this.setState({username: e.target.value})}/>
                <input type="password" placeholder="password" onChange={e => this.setState({password: e.target.value})}/>
                <input onChange={e => {this.setState({admin: !this.state.admin})}} type="checkbox"/>admin?
                <button onClick={this.signup}>Sign up</button>
                <br/>
                {this.state.message}
            </div>
        );
    }
}

export default Signup;
