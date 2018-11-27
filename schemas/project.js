module.exports = `
  type Project  {
    id: ID
    name: String
    description: String
    specie: Specie
    researchersFilter(search: searchResearcherInput, order: [ orderResearcherInput ], pagination: paginationInput): [Researcher]
    countFilteredResearchers(search: searchResearcherInput) : Int
  }

  type VueTableProject{
    data : [Project]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum ProjectField {
    id 
    name  
    description  
  }

  input searchProjectInput {
    field: ProjectField
    value: typeValue
    operator: Operator
    search: [searchProjectInput]
  }

  input orderProjectInput{
    field: ProjectField
    order: Order
  }

  type Query {
    projects(search: searchProjectInput, order: [ orderProjectInput ], pagination: paginationInput ): [Project]
    readOneProject(id: ID!): Project
    countProjects(search: searchProjectInput ): Int
    vueTableProject : VueTableProject  }

    type Mutation {
    addProject( name: String, description: String, specieId: Int  , researchers:[ID] ): Project
    deleteProject(id: ID!): String!
    updateProject(id: ID!, name: String, description: String, specieId: Int  , researchers:[ID]): Project!
    bulkAddProjectXlsx: [Project]
    bulkAddProjectCsv: [Project]
}
  `;