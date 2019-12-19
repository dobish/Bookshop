import React, { Component } from 'react';

class Signin extends Component {
    state = {
        username: '',
        password: ''
    }

    signin = () => {
        fetch('http://localhost:8080/authenticate', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then(res => res.json())
            .then(r => {
                localStorage.setItem("token", r.token);
                localStorage.setItem("username", r.username);
                localStorage.setItem("admin", r.admin)
                console.log(r.admin)
                window.location.reload();
            })
    }



    render() {
        return (
            <div>
                <input type="text" placeholder="username" onChange={e => this.setState({username: e.target.value})}/>
                <input type="password" placeholder="password" onChange={e => this.setState({password: e.target.value})}/>
                <button onClick={this.signin}>Sign in</button>
            </div>
        );
    }
}

export default Signin;
