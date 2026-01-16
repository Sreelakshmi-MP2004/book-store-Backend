// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.paymentKey);

const stripe = require('stripe')(process.env.paymentKey);


const books = require('../models/bookModel')

exports.addBook = async (req, res) => {
    console.log("Inside add Book");
    console.log(req.body);

    const { title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category } = req.body
    // Image file to filename
    console.log(req.files); // Image file [{...},{},{}]
    const UploadedImages = []
    req.files.map(item => UploadedImages.push(item.filename))
    console.log(UploadedImages); // [img,img,img]

    // get userMail from JWT verification
    const userMail = req.payload
    console.log(userMail);


    // Add book

    try {
        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(402).json("Book alredy exist...")
        }
        else {
            const newBook = new books({ title, author, noofpages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, UploadedImages, userMail })
            await newBook.save()
            res.status(200).json({ message: "Book Added Successfully..." })
        }
    } catch (err) {
        res.status(500).json("Err" + err)
    }

    // res.send("Request Received...")
}

exports.getBooks = async (req, res) => {
    console.log(req.query); // {search: "luminar"}
    console.log(req.query.search);
    searchKey = req.query.search

    try {
        const query = {
            title: {
                $regex: searchKey,
                $options: 'i'
            }
        }

        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    }
    catch (err) {
        res.status(500).json("Err" + err)
    }
}

exports.getHomeBooks = async (req, res) => {
    try {
        const allBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.viewBooks = async (req, res) => {
    console.log(req.params);

    try {
        const { id } = req.params
        console.log(id);

        const viewExistBook = await books.findById(id)

        if (viewExistBook) {
            res.status(200).json(viewExistBook)
        } else {
            res.status(404).json("Book Not Found")
        }

    } catch (err) {
        res.status(500).json(err)
    }


    // res.send('request received')

}

exports.buyBook = async (req, res) => {
    console.log("Inside Payment");
    const { bookDetails } = req.body
    email = req.payload.userMail
    try {
        const existingBook = await books.findByIdAndUpdate(bookDetails._id, {
            title: bookDetails.title,
            author: bookDetails.author,
            noofpages: bookDetails.noofpages,
            imageUrl: bookDetails.imageUrl,
            price: bookDetails.price,
            dprice: bookDetails.dprice,
            abstract: bookDetails.abstract,
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            isbn: bookDetails.isbn,
            category: bookDetails.category,
            UploadedImages: bookDetails.UploadedImages,
            status: "Sold",
            userMail: bookDetails.userMail,
            brought: email
        },
            { new: true }
        )
        const line_items = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: bookDetails.title,
                        description: `${bookDetails.author} | ${bookDetails.publisher}`,
                        images: [bookDetails.imageUrl],
                        metadata: {
                            title: bookDetails.title,
                            author: bookDetails.author,
                            noofpages: bookDetails.noofpages,
                            imageUrl: bookDetails.imageUrl,
                            price: bookDetails.price,
                            dprice: bookDetails.dprice,
                            abstract: bookDetails.abstract,
                            publisher: bookDetails.publisher,
                            language: bookDetails.language,
                            isbn: bookDetails.isbn,
                            category: bookDetails.category,
                            UploadedImages: bookDetails.UploadedImages,
                            status: "sold",
                            userMail: bookDetails.userMail,
                            brought: email,
                        },
                    },
                    unit_amount: Math.round(Number(bookDetails.dprice) * 100),
                },
                quantity: 1,
            },
        ];
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: 'http://localhost:5173/payment-success',
            cancel_url: 'http://localhost:5173/payment-error',
            line_items,
            mode: 'payment',
        });

        res.status(200).json({ message: "Success", session, sessionID:session.id })
    } catch (err) {
        res.status(500).json("Payment Error" + err)
    }
}
