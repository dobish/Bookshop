import React, {Component} from 'react';
import {Link} from "@reach/router";
import Login from "./Login";
import AuthService from './AuthService';
import Cookies from 'js-cookie';

class Categories extends Component {

    handleChange(event) {
        const value = event.target.value;
        this.setState({
            [event.target.name]: value
        });
    }
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            kittens: [],      // Data from API
            loginStatus: "",  // Message for the user when not logged in
            loginType: "",    // Type of login used
            displayName: ""     // Display name from social media
        };
    }


    //let categoriesList = this.props.categ

    async login(username, password) {
        try {
            const resp = await this.Auth.login(username, password);
            console.log("Authentication for", resp.username);
            this.setState({
                loginType: "username / password",
                displayName: username
            });
            this.getData();
        } catch (e) {
            console.log("Login", e);
        }
    }

    async getData() {
        const resp = await this.Auth.fetch(`${this.API_URL}/categories`);
        if (resp.status === 401) {
            this.setState({
                loginStatus: "You need to login!"
            })
        } else {
            const data = await resp.json();
            this.setState({
                kittens: data,
                loginStatus: ""
            });
        }
    }
    render() {
        return (
            <React.Fragment>
                <h1>Categories</h1>
                <ol>
                    {this.props.categories.map(c =>(
                        <li key={c._id}>
                            <Link to={`/categories/${c._id}`}>{c.category}</Link>
                        </li>))}
                </ol>

                <input name="newCategoryName" onChange={(event) => this.handleChange(event)} type="text"/>
                <button onClick={_ => this.props.addCategory(this.state.newCategoryName)} type="submit">Add New Category</button>
            </React.Fragment>

        );
    }

}

export default Categories;
