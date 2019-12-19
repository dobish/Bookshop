

class Db {
    /**
     * Constructors an object for accessing categories in the database
     * @param mongoose the mongoose object used to create schema objects for the database
     */
    API_URL = process.env.REACT_APP_API_URL;
    constructor(mongoose) {
        const Schema = mongoose.Schema;

        // This is the schema we need to store categories in MongoDB
        const bookStoreSchema = new mongoose.Schema({
            category: String,
            //hobbies: [String] // A list of hobbies as string
            books: [{title: String, author: String, price: Number, seller: String}]
        });


        const User = mongoose.model('User',
            mongoose.Schema({
                _id: mongoose.Schema.Types.ObjectId,
                username: String,
                password: String,
                admin: Boolean
            })
        );





        // This model is used in the methods of this class to access categories
        this.bookModel = mongoose.model('book', bookStoreSchema);
        //this.categoryModel = mongoose.model('category', categorySchema);


    }

    async getCategoryName(name) {
        try {
            return await this.bookModel.find({ categoryName: name });
        } catch (error) {
            console.error("getCategoryName:", error.message);
            return {};
        }
    }

    async getCategories() {
        try {
            return await this.bookModel.find({});
        } catch (error) {
            console.error("getCategories:", error.message);
            return {};
        }
    }

    async getBooks() {
        try {
            return await this.bookModel.find({});
        } catch (error) {
            console.error("getBooks:", error.message);
            return {};
        }
    }

    async createBook(newBook) {
        let book = new this.bookModel(newBook);
        return book.save();
    }

    async getBook(id) {
        try {
            return await this.bookModel.findById(id);
        } catch (error) {
            console.error("getBook:", error.message);
            return {};
        }
    }

    async getBoo() {
        try {
            return await this.bookModel.find();

        } catch (error) {
            console.error("getBook:", error.message);
            return {};
        }
    }



    async getCategory(id) {
        try {
            return await this.bookModel.findById(id);
        } catch (error) {
            console.error("getCategory:", error.message);
            return {};
        }
    }

    async getBookCategory(categoryId) {
        try {
            return await this.bookModel.findById(categoryId);
        } catch (error) {
            console.error("getCategory:", error.message);
            return {};
        }
    }
    /*async addBook(categoryId, title, author, price, seller) {
        const bookAdd = await this.getCategory(categoryId);
        console.log("Line 96" + bookAdd + "the end")
        console.log("That should be a console log with a title" + " " + bookAdd.books[0].title)
        title = bookAdd.books[0].title;
        author = bookAdd.books[0].author;
        price = bookAdd.books[0].price ;
        seller = bookAdd.books[0].seller;
        bookAdd.books.push(title, author, price, seller);
/!*        await fetch(`${this.API_URL}/categories/${categoryId}/books/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                title: title,
                author: author,
                price: price,
                seller: seller
            })
        });
        await this.fetchData();*!/
        try{
            return bookAdd.save();
        } catch (error){return{};}
    }*/
    async createCategory(newCategory) {
        let category = new this.bookModel(newCategory);
        return category.save();
    }

    async addBook(id, book){
        //let book = new this.bookModel(newBook);
        const category = await this.getCategory(id);
        const newBook = {
            title: book.title,
            author: book.author
        };
        //let book = await this.getCategory(category);
         category.books.push(newBook);
        return category.save();
    }

    async assignBook(categoryId, book) {
        const category = await this.getCategory(categoryId);
        category.bookObject.push(book);
        return category.save();
    }

    /**
     * This method adds a bunch of test data if the database is empty.
     * @param count The amount of categories to add.
     * @returns {Promise} Resolves when everything has been saved.
     */
    async bootstrap(count = 10) {
        const titles = [
            {title: "Title1", author: "Author1", price: 20, seller: "Seller1"},
            {title: "Title2", author: "Author2", price: 2541, seller: "Seller2"},
            {title: "Title3", author: "Author3", price: 155321, seller: "Seller3"}
            ];
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function getRandomName() {
            return ['Programming', 'ReactJS', 'Design', 'Virtual Reality'][getRandomInt(0,3)]
        }

        function getRandomTitle() {
            const shuffled = titles.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, getRandomInt(1,shuffled.length));
        }


        function assignRandomId() {
            //const shuffled = hobbies.sort(() => 0.5 - Math.random());
            return [getRandomTitle(), getRandomTitle()];
        }

        let l = (await this.getCategories()).length;

        console.log("Book collection size:", l);

        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let category = new this.bookModel({
                    category: getRandomName(),
                    books: getRandomTitle()
                });
                promises.push(category.save());
            }

            return Promise.all(promises);
        }

    }
}

// We export the object used to access the categories in the database
module.exports = mongoose => new Db(mongoose);