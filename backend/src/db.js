const { connect } = require("mongoose")

const connectDb = async () => {
  return connect("mongodb://localhost:27017/lms")
}

module.exports = { connectDb }
