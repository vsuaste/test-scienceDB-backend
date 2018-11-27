module.exports = `
  type Specie  {
    id: ID
    nombre: String
    e_nombre_comun_principal: String
    e_foto_principal: String
    nombre_cientifico: String
      projectsFilter(search: searchProjectInput, order: [ orderProjectInput ], pagination: paginationInput): [Project]
    countFilteredProjects(search: searchProjectInput) : Int
  }

  type VueTableSpecie{
    data : [Specie]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum SpecieField {
    id 
    nombre  
    e_nombre_comun_principal  
    e_foto_principal  
    nombre_cientifico  
  }

  input searchSpecieInput {
    field: SpecieField
    value: typeValue
    operator: Operator
    search: [searchSpecieInput]
  }

  input orderSpecieInput{
    field: SpecieField
    order: Order
  }

  type Query {
    species(search: searchSpecieInput, order: [ orderSpecieInput ], pagination: paginationInput ): [Specie]
    readOneSpecie(id: ID!): Specie
    countSpecies(search: searchSpecieInput ): Int
    vueTableSpecie : VueTableSpecie  }

  `;