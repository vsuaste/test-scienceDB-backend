module.exports = `
  type Publisher  {
    id: ID
    name: String
    phone: String
      booksFilter(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput): [Book]
    countFilteredBooks(search: searchBookInput) : Int
  }

  type VueTablePublisher{
    data : [Publisher]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum PublisherField {
    id 
    name  
    phone  
  }

  input searchPublisherInput {
    field: PublisherField
    value: typeValue
    operator: Operator
    search: [searchPublisherInput]
  }

  input orderPublisherInput{
    field: PublisherField
    order: Order
  }

  type Query {
    publishers(search: searchPublisherInput, order: [ orderPublisherInput ], pagination: paginationInput ): [Publisher]
    readOnePublisher(id: ID!): Publisher
    countPublishers(search: searchPublisherInput ): Int
    vueTablePublisher : VueTablePublisher  }

  `;