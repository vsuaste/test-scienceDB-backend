module.exports = `
  type Dog  {
    id: ID
    name: String
    breed: String
    person: Person
  researcher: Researcher
    }

  type VueTableDog{
    data : [Dog]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum DogField {
    id 
    name  
    breed  
  }

  input searchDogInput {
    field: DogField
    value: typeValue
    operator: Operator
    search: [searchDogInput]
  }

  input orderDogInput{
    field: DogField
    order: Order
  }

  type Query {
    dogs(search: searchDogInput, order: [ orderDogInput ], pagination: paginationInput ): [Dog]
    readOneDog(id: ID!): Dog
    countDogs(search: searchDogInput ): Int
    vueTableDog : VueTableDog  }

    type Mutation {
    addDog( name: String, breed: String, personId: Int, researcherId: Int   ): Dog
    deleteDog(id: ID!): String!
    updateDog(id: ID!, name: String, breed: String, personId: Int, researcherId: Int  ): Dog!
    bulkAddDogXlsx: [Dog]
    bulkAddDogCsv: [Dog]
}
  `;