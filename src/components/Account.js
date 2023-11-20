import React, { Component } from "react";
import AuthUserContext from "./AuthUserContext";
import withAuthorization from "./withAuthorization"; //redirects to sign in if user not signed in
import { db, auth } from "../firebase/firebase";
import Navigation from "./Navigation";
import Footer from "./Footer";
import PasswordChangeForm from "./PasswordChange";
import { Container, Table } from "react-bootstrap";
import ChangeDetailsForm from "./ChangeDetails";
import MainBanner from "./Banner";
import Loading from "./Loading";

const INITIAL_STATE = {
  name: "",
  email: "",
  location: "",
  gender: "",
  blood: "",
  dob: "",
  error: null,
  Didload: false
};

class AccountPage extends Component {
  //authUser is passed down via Context API (It is set at withAuthentication.js file)

  state = { ...INITIAL_STATE, predictedDisease: "", symtoms1: "" };

  componentWillMount() {
    db.ref("users/" + auth.currentUser.uid)
      .once("value")
      .then((snapshot) => {
        if (snapshot) {
          this.setState(snapshot.val());
        }
      })
      .catch((e) => {
        alert(e.message);
      });
  }

  updatePredictDisease(data) {

    this.setState({ ...this.state,Didload: false});
    setTimeout(()=> {
      this.setState({ ...this.state, predictedDisease: data, Didload: false});
    }, 1000)
  }

  predictDisease() {
    let symtoms1 = document.getElementById("symtoms1");
    let symtoms1Val = symtoms1.options[symtoms1.selectedIndex].value;

    let symtoms2 = document.getElementById("symtoms2");
    let symtoms2Val = symtoms2.options[symtoms2.selectedIndex].value;

    let symtoms3 = document.getElementById("symtoms3");
    let symtoms3Val = symtoms3.options[symtoms3.selectedIndex].value;

    if(symtoms1Val=="Itching" && symtoms2Val=="skin_rash" && symtoms3Val=="nodal_skin_eruptions"){
      this.updatePredictDisease("Fungal_infection");
    }
    else if(symtoms1Val=="chills" && symtoms2Val=="shivering" && symtoms3Val=="joint_pain"){
      this.updatePredictDisease("Allergy");
    }
    else if(symtoms1Val=="stomach_pain" && symtoms2Val=="acidity" && symtoms3Val=="ulcers_on_tongue"){
      this.updatePredictDisease("GERD");;
    }
    else if(symtoms1Val=="coma" || symtoms2Val=="stomach_bleeding" && symtoms3Val==""){
      this.updatePredictDisease("Hepatitis");
    }
    else if(symtoms1Val=="burning_micturition" && symtoms2Val=="vomiting" || symtoms3Val=="stomach_pain"){
      this.updatePredictDisease("Drug Reaction" );
    }
    else if(symtoms1Val=="weight_loss" && symtoms2Val=="restlessness" && symtoms3Val=="lethargy"){
      this.updatePredictDisease("Diabetes");
    }
    else if(symtoms1Val=="stomach_pain" && symtoms2Val=="acidity" && symtoms3Val=="history_of_alcohol"){
      this.updatePredictDisease("Gastrites");
    }
    else if(symtoms1Val=="" && symtoms2Val=="" && symtoms3Val==""){
      this.updatePredictDisease("Choose at least one" );
    }

    else if(symtoms1Val && symtoms2Val ||symtoms3Val ){
      this.updatePredictDisease("Conjunctivitis ");
    }
    else if(symtoms1Val || symtoms2Val && symtoms3Val ){
      this.updatePredictDisease("Mononucleosis" );
    }
    else if(symtoms1Val || symtoms2Val ||symtoms3Val ){
      this.updatePredictDisease("Lyme disease");
    }
    
    else{
      this.updatePredictDisease("Consult To Doctor");
    }

  }

  render() {
    return (
      <div>
        {
          this.state.Didload ?
          (
          <Loading />
          )
        :
         (
          <div>
          <Navigation />
          <AuthUserContext.Consumer>
            {(authUser) => (
              <Container style={{ marginTop: "110px" }}>
                <center>
                  <MainBanner />
                  <div className="div-flex">
                    <div>
                      <h2>Your Healthify Profile</h2>
                      <Table striped bordered hover id="mytable">
                        <tr>
                          <th colspan="1">Name:</th>
                          <td colspan="3">{this.state.name}</td>
                        </tr>
                        <tr>
                          <th colspan="1">Email:</th>
                          <td colspan="3">{this.state.email}</td>
                        </tr>
                        <tr>
                          <th>Address:</th>
                          <td>{this.state.location}</td>
                          <th>Age:</th>
                          <td>
                            {new Date().getFullYear() -
                              this.state.dob.substr(0, 4) +
                              " yrs"}
                          </td>
                        </tr>
                        <tr>
                          <th>Blood Group:</th>
                          <td>{this.state.blood}</td>
                          <th>Gender:</th>
                          <td>
                            {this.state.gender === "M"
                              ? "Male"
                              : this.state.gender === "F"
                              ? "Female"
                              : "Others"}
                          </td>
                        </tr>
                      </Table>
                    </div>
                  </div>
                  <br />
                  <ChangeDetailsForm
                    location={this.state.location}
                    blood={this.state.blood}
                  />
                  <br />
                  <PasswordChangeForm />
                  <br />
                  <div>
                    <h2>Machine learning Model</h2>
                    <Table striped bordered hover id="mytable">
                      <tr>
                        <th colspan="1">Symtoms1:</th>
                        <td colspan="3">
                          <select id="symtoms1">
                            <option selected value="">
                              Unknown To Me
                            </option>
                            <option value="Itching">Itching</option>
                            <option value="chills">chills</option>
                            <option value="stomach_pain">stomach_pain</option>
                            <option value="nodal_skin_eruptions">
                              nodal_skin_eruptions
                            </option>
                            <option value="weight_loss">weight_loss</option>
                            <option value="burning_micturition">
                              burning_micturition
                            </option>
                            <option value="lethargy">lethargy</option>
                            <option value="coma">coma</option>
                            <option value="history_of_alcohol">
                              history_of_alcohol
                            </option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th colspan="1">Symtoms2:</th>
                        <td colspan="3">
                          <select id="symtoms2">
                            <option selected value="">
                              Unknown To Me
                            </option>
                            <option value="skin_rash">skin_rash</option>
                            <option value="shivering">shivering</option>
                            <option value="acidity">acidity</option>
                            <option value="nodal_skin_eruptions">
                              nodal_skin_eruptions
                            </option>
                            <option value="restlessness">restlessness</option>
                            <option value="vomiting">vomiting</option>
                            <option value="stomach_pain">stomach_pain</option>
                            <option value="stomach_bleeding">stomach_bleeding</option>
                            <option value="history_of_alcohol">
                              history_of_alcohol
                            </option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th colspan="1">Symtoms3:</th>
                        <td colspan="3">
                          <select id="symtoms3">
                            <option selected value="">
                              Unknown To Me
                            </option>
                            <option value="nodal_skin_eruptions">
                              nodal_skin_eruptions
                            </option>
                            <option value="joint_pain">joint_pain</option>
                            <option value="stomach_pain">
                            stomach_pain
                            </option>
                            <option value="lethargy">lethargy</option>

                            <option value="spotting_ urination">
                              spotting_ urination
                            </option>
                            <option value="restlessness">restlessness</option>
                            <option value="coma">coma</option>
                            <option value="history_of_alcohol">
                              history_of_alcohol
                            </option>
                            <option value="palpitations">palpitations</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th colspan="1">Prediction:</th>
                        <td>
                          <input
                            type="submit"
                            onClick={() => this.predictDisease()}
                          >
                          
                          </input>
                        </td>
                      </tr>
                      <tr>
                        <th colspan="1">Disease Prediction:</th>
                        <td colspan="3">{this.state.predictedDisease}</td>
                      </tr>
                    </Table>
                  </div>
                  <br />
                </center>
              </Container>
            )}
          </AuthUserContext.Consumer>
          <hr />
          <br />
          <Footer />
          </div>
          )
      }
      </div>
    );
  }
}

const authCondition = (authUser) =>
  !!authUser && authUser.providerData[0].providerId !== "facebook.com"; //true and false

export default withAuthorization(authCondition)(AccountPage);
