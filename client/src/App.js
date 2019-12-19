import React, {Component} from 'react';
import {Router} from "@reach/router";
import Category from "./Category";
import Categories from "./Categories";
import Book from "./Book";
import AuthService from './AuthService';
import Signin from './Signin';
import Signup from './Signup';
import Login from "./Login";

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            categories: [],
            kittens: [],
            loginStatus: "",  // Message for the user when not logged in
            loginType: "",    // Type of login used
            displayName: ""     // Display name from social media
        };
    }

    componentDidMount() {
        this.fetchData().then(() => console.log("Books gotten!"));
    }






    async fetchData() {
      //const resp = await this.Auth.fetch(`${this.API_URL}/categories`)
        //if (resp.status === 401) {
        let url = `${this.API_URL}/categories`; // URL of the API.
            /*this.setState({
                loginStatus: "You need to login!",
                categories: result
            })*/
            fetch(url)
                .then(result => result.json()) // Convert to JSON
                .then(result => { // Put it in the state
                    this.setState({categories: result})})
            console.log(this.state.categories)
        } /*else {
            const data = await resp.json();
            this.setState({
                kittens: data,
                loginStatus: ""
            });
            console.log(this.state.categories)
        }*/
    //}

/*        let url = `${this.API_URL}/categories`; // URL of the API.
        console.log(url)
        fetch(url)
            .then(result => result.json()) // Convert to JSON
            .then(result => { // Put it in the state
                this.setState({
                    categories: result
                })
                console.log(this.state.categories)
            })
            .catch((error) => { // Catch any errors and write them to the browser console
                console.error(error);
            });
    }*/

     getCategory(id) {
        return this.state.categories.find(k => k._id === id);
    }

    async addCategory(name) {
         console.log("yep it fired")
        await fetch(`${this.API_URL}/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({name: name})
        });
        await this.fetchData();
    }



    render() {
        return (
            <div className="container">
                {localStorage.getItem("token") == null ?
                    <div>
                        <button><a href="/signin">signin</a></button>
                        <button><a href="/signup">signup</a></button>
                    </div>
                    :
                    <button onClick={this.logOut}>log out</button>
                }
                <Router>
                    <Category path="/categories/:id" getCategory={id => this.getCategory(id)}
                              addHobby={(categoryId, hobby) => this.addHobby(categoryId, hobby)} />
                    <Categories path="/" categories={this.state.categories}
                                addCategory={name => this.addCategory(name)}/>
                    <Book path="/categories/:idC/books/:idB" getCategory={idC => this.getCategory(idC)}/>
                    <Signup path="/signup"/>
                   {/* <Login path="/" login={(username, password) => this.login(username, password)}/>*/}


                </Router>
            </div>
        );
    }
}

export default App;
