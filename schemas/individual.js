module.exports = `
  type individual  {
    id: ID
    name: String
      transcript_countsFilter(search: searchTranscript_countInput, order: [ orderTranscript_countInput ], pagination: paginationInput): [transcript_count]
    countFilteredTranscript_counts(search: searchTranscript_countInput) : Int
  }

  type VueTableIndividual{
    data : [individual]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum individualField {
    id 
    name  
  }

  input searchIndividualInput {
    field: individualField
    value: typeValue
    operator: Operator
    search: [searchIndividualInput]
  }

  input orderIndividualInput{
    field: individualField
    order: Order
  }

  type Query {
    individuals(search: searchIndividualInput, order: [ orderIndividualInput ], pagination: paginationInput ): [individual]
    readOneIndividual(id: ID!): individual
    countIndividuals(search: searchIndividualInput ): Int
    vueTableIndividual : VueTableIndividual  }

    type Mutation {
    addIndividual( name: String , transcript_counts:[ID] ): individual
    deleteIndividual(id: ID!): String!
    updateIndividual(id: ID!, name: String , transcript_counts:[ID]): individual!
    bulkAddIndividualXlsx: [individual]
    bulkAddIndividualCsv: [individual]
}
  `;