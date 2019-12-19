import React, {Component} from 'react';
import {Link, Router} from "@reach/router";


class Category extends Component {

    handleChange(event) {
        const value = event.target.value;
        this.setState({
            [event.target.name]: value
        });
    }

    render() {
        const category = this.props.getCategory(this.props.id);
        console.log(this.props.id);
        console.log(category)

        let content = <p>Loading</p>;
        if (category) {
            content =
                <React.Fragment>
                    <h1>Category: {category.title}</h1>


                    {category.books.map(a => (
                        <div className="books" key={a}>
                            <p>{a.title}</p>
                            <li> <Link to={`/categories/${category._id}/books/${a._id}`}>{a.title}</Link></li>
                        </div>
                    ))}

                    <input name="newHobby" onChange={(event) => this.handleChange(event)} type="text"/>
                    <button onClick={(event) => this.props.addHobby(this.props.id, this.state.newHobby)}
                            type="submit">Add New Book</button>

                    <br/>
                    <Link to="/">Back</Link>
                </React.Fragment>
        }

        return content;
    }
}

export default Category;
