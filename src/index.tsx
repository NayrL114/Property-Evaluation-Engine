import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';

// A Result interface to store the element for front-end displaying. 
// An array storing Result type is declared in the PropertyEvaluation's state. 
// implementation of interface is read from following link: 
//  https://www.pluralsight.com/guides/use-interface-props-in-functional-components-using-typescript-with-react
interface Result{
  text?: string,
  id?: number
}

interface AppState{
  zone: string,
  size: number,
  isFloodzone: boolean, 
  results: Array<Result>,
  listSize: number, 
  errorMsgZone?: string, 
  errorMsgSize?: string
}

// class implementation is mostly following tutorial on reactjs.org
class PropertyEvaluation extends React.Component<{}, AppState> {
  // Declaring types for typescript.  
  constructor(props: any){// props is declared as any so compiler won't complain. 
    // I am also not sure how is props element properly declared, 
    //  I searched for solutions and found out any type is enough, 
    //  so for now I will keep the props element as any type to ensure the program can run. 
    super(props);
    this.state = {
      zone: '0',// string
      size: 0,// number
      isFloodzone: false,// boolean
      results: Array<Result>(4), // Array<Result>, this initialises a empty Result[] array with 4 pre-allocated spaces
      listSize: 0// number
    }

    // Functions for handling input changes and form submission
    this.handleChangeZone = this.handleChangeZone.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
    this.handleChangeFlood = this.handleChangeFlood.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Functions for checking valid building types
    this.checkRules = this.checkRules.bind(this);
    this.checkSingleDwellingHouse = this.checkSingleDwellingHouse.bind(this);
    this.checkApartmentComplex = this.checkApartmentComplex.bind(this);
    this.checkCommercialBuilding = this.checkCommercialBuilding.bind(this);
  }
  
  render(){// All the HTML codes are in here. 
    return(
      <div className="App">

        <div id="inputArea">
          <h1>Property Facts</h1>

          <form id="factsInput" onSubmit={this.handleSubmit}>
            <label htmlFor="ZoneInput">
              Zone <br></br>
              <select value={this.state.zone} onChange={this.handleChangeZone}>
                <option value='0'>Please Select</option>
                <option value='1'>Zone 1</option>
                <option value='2'>Zone 2</option>
                <option value='3'>Zone 3</option>
              </select>
            </label>
            <br></br>
            <label style={{color: "red"}}> {this.state.errorMsgZone} </label>         

            <br></br>
            <br></br>

            <label htmlFor="SizeInput">
              Size <br></br>
              <input
                name="size"
                type="number"
                value={this.state.size || ''}
                onChange={this.handleChangeSize}
              />
              Square Metres
            </label>
            <br></br>
            <label style={{color: "red"}}> {this.state.errorMsgSize} </label>

            <br></br>
            <br></br>

            <label htmlFor="FloodInput">
              Is flooding area?
              <input
                name="isFloodzone"
                type="checkbox"
                checked={this.state.isFloodzone}
                onChange={this.handleChangeFlood}
              />
            </label>
            
            <br></br>
            <br></br>

            <input type="submit" value="Submit"/>
          </form>
          
        </div>

        <div id="analysisResults">
          <h1>Analysis Results</h1>
          <p>Based on these property facts, the allowed building types are: </p>
          <ul id="resultsList">
            {this.state.results.map(result => (
              <li key={result.id}>{result.text}</li>
            ))}
          </ul>
        </div>

      </div>
    );
  }// end of render()
  /** it is relatively hard to write comment in render() so I put them here instead:
   *  Input-forms related implementation in React: https://reactjs.org/docs/forms.html 
   *  ul display list implementation: https://reactjs.org/ - TODO list section
   *  size input empty placeholder implementation: 
   *    https://stackoverflow.com/questions/47642449/initializing-react-number-input-control-with-blank-value 
   *  Crucial information about this.state update, which helped me to decide how to implement code for updating array:
   *    https://linguinecode.com/post/why-react-setstate-usestate-does-not-update-immediately
   */
  
  // Information about event types for changeHandler is from following link: 
  //  https://stackoverflow.com/questions/46666036/typescript-react-setstate-with-user-input 
  // Change handler for Zone input. 
  handleChangeZone(e: React.ChangeEvent<HTMLSelectElement>){
    this.setState({zone: e.currentTarget.value});
  }

  // Change handler for Size input. 
  handleChangeSize(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({size: Number(e.currentTarget.value)});
  }

  // Change handler for isFloodzone input. 
  handleChangeFlood(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({isFloodzone: e.currentTarget.checked});
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>){      
    // Submit event's information is read from following link: 
    // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    e.preventDefault();

    if (isNaN(this.state.size)){// if isNan(this.state.size) returns true, then is it not a number. 
      return;// stop the submit operation if this.stats.size is not a number. 
    }

    this.setState({
      errorMsgZone: "",
      errorMsgSize: ""
    });

    if (this.state.zone === '0'){// Additional check to ensure size is not 0 or negative number. 
      this.setState({// resets the everything back to initial on invalid size input. 
        zone: '0', 
        size: 0,
        isFloodzone: false, 
        listSize: 0,
        results: [] as Result[], // Create a new empty Array storing Result type and assign it to the state.
        errorMsgZone: "Please select zone"
      });
      return;// stop the submit operation if size number is invalid. 
    }

    if (this.state.size <= 0){// Additional check to ensure size is not 0 or negative number.       
      this.setState({// resets the everything back to initial on invalid size input. 
        zone: '0', 
        size: 0,
        isFloodzone: false, 
        listSize: 0,
        results: [] as Result[], // Create a new empty Array storing Result type and assign it to the state.
        errorMsgSize: "Please input positive numbers"
      });
      return;// stop the submit operation if size number is invalid. 
    }

    
    
    // Pass the data stored in this.state to check the rules of building types
    this.checkRules(this.state.zone, this.state.size, this.state.isFloodzone);

    // Following codes will reset input fields back to initial after pressing submit button. 
    // Program is perfectly working with these codes included, but presents a different UX, 
    //  where users need to re-enter details if they want to see other results after first submit. 
    /*   
    this.setState(state => ({// Reset input fields
      zone: '0', 
      size: 0,
      isFloodzone: false,
    }));
    */

  }// end of handleSubmit(e)

  /** 
    Following codes are representation of the rules to determine building types. 
    In checkRules(), all 3 building types will be checked seperately, 
      if a building type is valid, it will be added to the results array for front-end display. 

    My idea is making every building types have their own rules-check function, 
      so if the rules for that building type needs changing or maintainance, 
      just go to that corresponding function and edit the if-check. 
    New building types' rule can also be added by creating a new rules-check function, 
      like checkManorHouse(zone, size, isFloodzone); 

    I think there might be a better way to implement the rules-check:  
      I was thinking storing the Building types and their corresponding rules as interface, 
      with an array storing that Building type, 
      and access that array for rules-check operation. 
    I also think maintaining rules-check via functions could become time-consuming if there are multiple housing types, 
      which is why I wanted to use array to store building types, 
      but I am not sure how to implement complex logic checks into array-storable elements, 
      so I decided to use function-based rules-check, 
      and I am quite happy with the this implementation method. 
  */

  checkRules(zone: string, size: number, isFloodzone: boolean/*, listSize: number*/){
    /**
     * This checkRules() function is used to check the input of property rules, 
     *  and determine which building types are valid. 
     * This function will make a copy of existing results array from this.state, 
     *  and modify this copy while validating building types, 
     *  and finally assign the modified copy back into this.state. 
     */

    let currentListSize: number = 0;// A seperate iterator for keeping track of array copy in this function.
    let resultHolder: Array<Result> = this.state.results.slice();// Making a copy of existing this.state.result array. 
    for (let i = resultHolder.length; i >= 0; i--){// Emptying the array copy and get ready for data entry. 
      resultHolder.pop();
      // array.pop() tutorial from: 
      //  https://www.educative.io/answers/how-to-remove-an-arrays-element-in-typescript-using-pop
    }

    /**
     * check-functions return boolean type, 
     *  indicating if corresponding building types are valid under current property condition.
     * Based on the returned boolean, following codes will initialise Result type element for display array, 
     *  say if checkSingleDwellingHouse() returns true, 
     *  a Result element containing string "Single Dwelling House" will be inistalised for front-end display. 
     * Those Result type elements will be stored into a Result[] array for front-end display access, 
     *  with following codes will ensure that the array will properly updated after pressing submit. 
     * 
     * 4 Types of output can be initialised in this function:
     *  "Single Dwelling House"
     *  "Apartment Complex"
     *  "Commercial Building"
     *  "No suitable building types"
     *  */ 
    
    // Adding Single Dwelling House into display array
    if (this.checkSingleDwellingHouse(zone, isFloodzone, currentListSize)){
      let newResult: Result = {// 
        text: "Single Dwelling House", 
        id: currentListSize
      }
      resultHolder[currentListSize] = newResult;
      currentListSize++;
    }
    
    // Adding Apartment Complex into display array
    if (this.checkApartmentComplex(zone, size, isFloodzone, currentListSize)){
      let newResult: Result = {// 
        text: "Apartment Complex", 
        id: currentListSize
      }
      resultHolder[currentListSize] = newResult;
      currentListSize++;
    }

    // Adding Commercial Building into display array
    if (this.checkCommercialBuilding(zone, size, currentListSize)){
      let newResult: Result = {// 
        text: "Commercial Building", 
        id: currentListSize
      }
      resultHolder[currentListSize] = newResult;
      currentListSize++;
    }
    
    // If there are no suitable building types identified, reflected by currentListSize. 
    // If currentListSize is 0, that means no valid building types based on current rules. 
    if (currentListSize === 0){
      let newResult: Result = {// 
        text: "No suitable building types based on current property facts", 
        id: currentListSize
      }
      resultHolder[currentListSize] = newResult;
      currentListSize++;
    }

    // Update the main results array in state with modified resultHolder array. 
    this.setState(state => ({
      listSize: currentListSize, 
      results: resultHolder
    }));
    
  }// end of checkRules()

  checkSingleDwellingHouse(zone: string, isFloodzone: boolean, currentListSize: number): boolean{
    return ((zone === '1' || zone === '2') && !isFloodzone)
    /**
        These check-functions represents the rule for determine if this building type is valid. 
        For Single Dwelling House:
          Located in Zone 1 OR Zone 2
          No Explicit Size Limits or Requirements (so I did not pass in size element at all since it is not checked)
          Not in Floodzone
        Note: As Single Dwelling House does not have explicit size requirements, 
          a situation can be seen where very large size input (ie 100,000,000,000) 
          would return Single Dwelling House in a valid situation as result, 
          which, is working as intended but also hilarious. 
      */
  }

  checkApartmentComplex(zone: string, size: number, isFloodzone: boolean, currentListSize: number): boolean{
    return ((zone === '2' || zone === '3') && size >= 500 && !isFloodzone);
    /**
       * For Apartment Complex:
       *  Located in Zone 2 OR Zone 3
       *  At least 500 m2 size
       *  Not in Floodzone
       */
  }

  checkCommercialBuilding(zone: string, size: number, currentListSize: number): boolean{
    return ((zone === '3') && size > 1000);
    /**
       * For Commercial Building
       *  Located in Zone 3 only
       *  Larger than 1000 m2 size
       *  Can be in Floodzone (so I did not passed in isFloodzone boolean since it is not checked at all)
       */    
  }

}// end of PropertyEvaluation class

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <PropertyEvaluation />// Rendering the whole PropertyEvaluation class
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
