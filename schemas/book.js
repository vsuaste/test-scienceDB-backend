module.exports = `
  type Book  {
    id: ID
    title: String
    genre: String
    publisher: Publisher
    peopleFilter(search: searchPersonInput, order: [ orderPersonInput ], pagination: paginationInput): [Person]
    countFilteredPeople(search: searchPersonInput) : Int
  }

  type VueTableBook{
    data : [Book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum BookField {
    id 
    title  
    genre  
  }

  input searchBookInput {
    field: BookField
    value: typeValue
    operator: Operator
    search: [searchBookInput]
  }

  input orderBookInput{
    field: BookField
    order: Order
  }

  type Query {
    books(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput ): [Book]
    readOneBook(id: ID!): Book
    countBooks(search: searchBookInput ): Int
    vueTableBook : VueTableBook  }

    type Mutation {
    addBook( title: String, genre: String, publisherId: Int  , people:[ID] ): Book
    deleteBook(id: ID!): String!
    updateBook(id: ID!, title: String, genre: String, publisherId: Int  , people:[ID]): Book!
    bulkAddBookXlsx: [Book]
    bulkAddBookCsv: [Book]
}
  `;