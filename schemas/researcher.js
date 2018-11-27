module.exports = `
  type Researcher  {
    id: ID
    firstName: String
    lastName: String
    email: String
    dog: Dog
    projectsFilter(search: searchProjectInput, order: [ orderProjectInput ], pagination: paginationInput): [Project]
    countFilteredProjects(search: searchProjectInput) : Int
  }

  type VueTableResearcher{
    data : [Researcher]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum ResearcherField {
    id 
    firstName  
    lastName  
    email  
  }

  input searchResearcherInput {
    field: ResearcherField
    value: typeValue
    operator: Operator
    search: [searchResearcherInput]
  }

  input orderResearcherInput{
    field: ResearcherField
    order: Order
  }

  type Query {
    researchers(search: searchResearcherInput, order: [ orderResearcherInput ], pagination: paginationInput ): [Researcher]
    readOneResearcher(id: ID!): Researcher
    countResearchers(search: searchResearcherInput ): Int
    vueTableResearcher : VueTableResearcher  }

    type Mutation {
    addResearcher( firstName: String, lastName: String, email: String , projects:[ID] ): Researcher
    deleteResearcher(id: ID!): String!
    updateResearcher(id: ID!, firstName: String, lastName: String, email: String , projects:[ID]): Researcher!
    bulkAddResearcherXlsx: [Researcher]
    bulkAddResearcherCsv: [Researcher]
}
  `;