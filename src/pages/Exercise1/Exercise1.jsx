import React, { Component } from "react";
import axios from "axios";
import DescriptionExercise from "../DescriptionExercise";
import { ReactComponent as PokeballIcon } from "../../assets/icons/pokeball.svg";
import classes from "./Exercise1.module.scss";
import Card from "./Card/Card";

const instructions = [
    "Identifique e corrija todos os pontos que estão impactando(ou podem impactar no futuro) a performance da página.",
    "Corrija os pontos do código que vão contra as convenções do React.",
    "Sempre que um item é mudado de lista, ele deve aparecer na primeira posição da outra lista.",
    "Não mude a estrutura da página (tabelas, cards, etc...) e nem dos componentes (Stateless -> Stateful / Stateful -> Stateless)",
    "Não use Hooks.",
    "A solução final não deve apresentar nenhum erro ou warning no console do browser."
];
class Exercise1 extends Component {
    state = {
        availableElements: [],
        selectedElements: []
    }
    
    componentWillMount() {
        this.fetchPokemonList();
    }

    fetchPokemonList() {
        axios.get(`https://pokeapi.co/api/v2/pokemon?limit=500`).then(res => {
            const availableElements = res.data.results.map((item, ix) => {
                const number = this.getPokemonNumber(ix + 1);
                return ({
                    number,
                    iconURL:`https://www.serebii.net/pokedex-sm/icon/${number}.png`,
                    ...item
                })
            });
            this.setState(() => {return { availableElements }});
        });
    }

    getPokemonNumber(pokemonNumber ) {
        if (pokemonNumber < 10) return `00${pokemonNumber}`;
        if (pokemonNumber < 100) return `0${pokemonNumber}`;
        return pokemonNumber;
    };

    setSelectedElement(index) {
        const availableElements = this.state.availableElements.filter((item, i) => index !== i);
        const selectedItem = this.state.availableElements[index];
        const selectedElements = [...this.state.selectedElements];
        selectedElements.push(selectedItem);
        this.setState(() => {
            return {availableElements, selectedElements };
        });
    }

    render() {
        return (
            <div className={classes.Exercise1}>
                <DescriptionExercise instructions={instructions} />
                <div className={classes.Exercise1Container}>
                    <div className={classes.AvailableContainer}>
                        <table className={classes.Table}>
                            <tbody>
                                {this.state.availableElements.map((element, index) => (
                                    <tr key={element.name}>
                                        <td className={classes.Number}>
                                            <div>{`#${element.number}`}</div>
                                        </td>
                                        <td className={classes.Description}>
                                            <div className={classes.PokemonContainer}>
                                                <img src={element.iconURL} alt="Pokemon Icon"/>
                                                <span>{element.name}</span>
                                            </div>
                                        </td>
                                        <td className={classes.Action}>
                                            <PokeballIcon onClick={() => this.setSelectedElement(index)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={classes.CaptureContainer}>
                        {this.state.selectedElements.map((element, index) => (
                            <Card 
                                key={element.name}
                                number={`#${element.number}`}
                                name={element.name}
                                src={element.iconURL}
                                onClick={() => (
                                    this.setState(() => {
                                        return {
                                            availableElements: this.state.selectedElements.splice(index, 1).concat(this.state.availableElements)
                                        }
                                    })
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Exercise1;