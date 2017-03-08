import { Button, FormGroup, FormControl, ControlLabel  } from 'react-bootstrap'
import Collapse from '../components/Collapse'
import MyModal from '../components/MyModal'

function FieldGroup({ id, label, props }) {
          return (
            <FormGroup controlId={id}>
              <ControlLabel>{label}</ControlLabel>
              <FormControl {...props} />
            </FormGroup>
          );
        }

export class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    
    
    render() {
        
        
        return (
            <div className="footer">
                <Button onClick={ ()=> this.setState({ open: !this.state.open })} style={{float:"none", marginLeft: "auto"}}>Show footer</Button>
                <Collapse show={this.state.open}>
                    <div>
                        <table className="footer-copyright">
                    <tbody width="100%">
                    <tr>
                            <td className="align-left">IMAFLORA</td>
                            <td className="align-center">Atlas: a geografia da agropecuária brasileira</td>
                            <td className="align-right footer-right">
                                <MyModal show={this.state.showModal} onHide={() => this.setState({showModal: false})} title="Fale conosco">
                                    <form>
                                        <FieldGroup 
                                            id="feedbackEmail"
                                            type="email"
                                            label="Endereço de E-mail"
                                            placeholder="exemplo@exemplo.com"    
                                        />
                                        
                                         <FormGroup controlId="formControlsSelect">
                                              <ControlLabel>Tópico</ControlLabel>
                                                  <FormControl componentClass="select" placeholder="selecione">
                                                    <option value="comentario">Comentário</option>
                                                    <option value="sugestao">Sugestão</option>
                                                    <option value="duvida">Dúvida</option>
                                                    <option value="outro">Outros</option>
                                                  </FormControl>
                                        </FormGroup>
                                        
                                       <FormGroup controlId="finalidade">
                                            <ControlLabel>Comnetários</ControlLabel>
                                            <FormControl componentClass="textarea" placeholder="Conte-nos sobre suas experiências com o Atlas!" />
                                        </FormGroup>
                                        <Button type="submit">Enviar</Button>
                                    </form>
                                </MyModal>
                                <Button id="botao" onClick={() => this.setState({showModal: true})}> Teste </ Button>
                            </td>
                    </tr>
                    </tbody>
                    </table>
                    </div>
                </Collapse>
             </div>
        );
    }
}