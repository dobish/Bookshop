import React, {Component} from 'react';
import {Link} from "@reach/router";


class Book extends Component {



    render() {
        const category = this.props.getCategory(this.props.idC);
        console.log(this.props.idC);
        console.log(this.props.idB);
        console.log()
        let content = <p>Loading</p>;
        if (category) {
            content =
                <React.Fragment>
                    <h1>Category: {category.category}</h1>
                    {console.log(category._id)}

                    {category.books.map(a => {
                        {console.log(a._id)}
                        if(this.props.idB === a._id)
                        {return ( <div className="books" key={a}>
                            <p>Title: {a.title}</p>
                            <p>Author: {a.author}</p>
                            <p>Price: ${a.price}</p>
                            <p>Category: {category.category}</p>
                        </div>); }

                    })}




                    <br/>
                    <Link to="/">Back</Link>
                </React.Fragment>
        }

        return content;
    }
}

export default Book;
