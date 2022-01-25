const employees = [
    { id: 1, name: 'moe'},
    { id: 2, name: 'larry', managerId: 1},
    { id: 4, name: 'shep', managerId: 2},
    { id: 3, name: 'curly', managerId: 1},
    { id: 5, name: 'groucho', managerId: 3},
    { id: 6, name: 'harpo', managerId: 5},
    { id: 8, name: 'shep Jr.', managerId: 4},
    { id: 99, name: 'lucy', managerId: 1}
  ];
  
  const spacer = (text)=> {
    if(!text){
      return console.log('');
    }
    const stars = new Array(5).fill('*').join('');
    console.log(`${stars} ${text} ${stars}`);
  }
  
  spacer('findEmployeeByName Moe')
  // given a name and array of employees, return employee

function findEmployeeByName(employee, list){
    return list.reduce((acc, item)=>{
        if(!(acc.name === employee)){
            acc = item
        }
        return acc
    })
}

  console.log(findEmployeeByName('moe', employees));//{ id: 1, name: 'moe' }
  spacer('')
  
  spacer('findManagerFor Shep Jr.')
  //given an employee and a list of employees, return the employee who is the manager

  function findManagerFor(employee, list){
    if (employee.managerId === undefined) return {}
    return list.reduce((acc, item)=>{
      if(!(acc.id === employee.managerId)){
          acc = item
      }
      return acc
    })
  }

  console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees));//{ id: 4, name: 'shep', managerId: 2 }
  spacer('')
  
  spacer('findCoworkersFor Larry')
  
  function findCoworkersFor(employee, list){
    const team = employee.managerId
    return list.filter(item=> !(item === employee) && item.managerId === team)
  }

  //given an employee and a list of employees, return the employees who report to the same manager
  console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees));/*
  [ { id: 3, name: 'curly', managerId: 1 },
    { id: 99, name: 'lucy', managerId: 1 } ]
  */
  
  spacer('');

  spacer('findManagementChain for moe')

  // function findManagementChainForEmployee(employee, list){
  //   let management = []
  //   while(employee.managerId !== undefined){
  //       employee = findManagerFor(employee, list)
  //       management.unshift(employee)
  //   }
  //   return management
  // }

  // function findManagementChainForEmployee(employee, employees){
  //   if(employee.managerId === undefined) return []
  //   const manager = employees.filter(person => person.id === employee.managerId)
  //   return [...findManagementChainForEmployee(manager[0], employees), manager]
  // }

  const findManagementChainForEmployee = (employee, employees) => {
    if (!employee.managerId) return [];
    const mId = employee.managerId;
    for (let i in employees) {
      if (employees[i].id === mId) {
        const chain = [employees[i]]
        return chain.concat(findManagementChainForEmployee(employees[i], employees))
      };
    }
  }

  //given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager 
  console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees));//[  ]
  spacer('');
  
  spacer('findManagementChain for shep Jr.')
  console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees));/*
  [ { id: 1, name: 'moe' },
    { id: 2, name: 'larry', managerId: 1 },
    { id: 4, name: 'shep', managerId: 2 }]
  */
  spacer('');
  
  
  spacer('generateManagementTree')
  //given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.


  // function generateManagementTree(employees){
  //   const CEOArr = employees.filter(x => x.managerId === undefined)
  //   const ceo = CEOArr[0]
  //   if (employees.length === 0) return
  //   employees.forEach((element)=>{
  //       const manager = findManagerFor (element, employees)
  //       if(!employees.includes(manager)){
  //           const index = employees.indexOf(element)
  //           element.reports = []
  //           employees.splice(index, 1)
  //           element.reports.push(generateManagementTree(employees))
            
  //       }
  //   },)
  //   return ceo
  // }

  function generateManagementTree(employees){
    const bossArr = employees.filter(employee=>employees.includes(findManagerFor(employee, employees)) === false)
    if (employees.length === 0) return

    bossArr.forEach((boss)=>{
      const under = employees.filter(employee => employee.managerId === boss.id)
      boss.reports = [...under]
      const index = employees.indexOf(boss)
      employees.splice(index, 1)
      generateManagementTree(employees)
    })
    
    return bossArr[0]
  }

  console.log(JSON.stringify(generateManagementTree(employees), null, 2));
  /*
  {
    "id": 1,
    "name": "moe",
    "reports": [
      {
        "id": 2,
        "name": "larry",
        "managerId": 1,
        "reports": [
          {
            "id": 4,
            "name": "shep",
            "managerId": 2,
            "reports": [
              {
                "id": 8,
                "name": "shep Jr.",
                "managerId": 4,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "curly",
        "managerId": 1,
        "reports": [
          {
            "id": 5,
            "name": "groucho",
            "managerId": 3,
            "reports": [
              {
                "id": 6,
                "name": "harpo",
                "managerId": 5,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 99,
        "name": "lucy",
        "managerId": 1,
        "reports": []
      }
    ]
  }
  */
  spacer('');
  
  spacer('displayManagementTree')
  //given a tree of employees, generate a display which displays the hierarchy
  displayManagementTree(generateManagementTree(employees));/*
  moe
  -larry
  --shep
  ---shep Jr.
  -curly
  --groucho
  ---harpo
  -lucy
  */