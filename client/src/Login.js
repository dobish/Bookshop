import React, {Component} from 'react';

export default class Login extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleLogin() {
        this.props.login(this.state.username, this.state.password);
    }

    render() {
        return (
            <>
                <h3>Login with your username / password:</h3>
                <input onChange={event => this.handleChange(event)} type="text" name="username" placeholder="email"/>
                <input onChange={event => this.handleChange(event)} type="text" name="password" placeholder="password"/>
                <button onClick={_ => this.handleLogin()}>Login</button>
                <br/>
            </>
        )
    };
}