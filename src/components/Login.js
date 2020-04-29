import React, {useCallback} from 'react';
import { CirclePicker } from 'react-color';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import Dropzone from 'react-dropzone'
import Arweave from 'arweave/web'

function Login(props) {

  const arweave = Arweave.init();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        try{
          let jwk = JSON.parse(reader.result);
          arweave.wallets.jwkToAddress(jwk).then((address) => {
            arweave.wallets.getBalance(address).then((balance) => {
              props.setUser({
                jwk: jwk,
                address: address,
                balance: arweave.ar.winstonToAr(balance)
              })
            });
          })
          .catch((e) => alert("This file is not valid"))
        }
        catch(e){alert("This file is not valid")}
      }
      reader.readAsText(file)
    })
  }, [])

  if(!props.user)
    return (
      <section>
        <Dropzone onDrop={onDrop}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p className="dropin">
                <FileCopyIcon />
                Drag 'n' drop your Arweave file, or click to select it
              </p>
            </div>
          )}
        </Dropzone>
      </section>
    )
  else
    return (
      <section>
        <div style={{float: 'left'}}>
          <CirclePicker onChangeComplete={props.pickColor} />
        </div>
        <ul>
          <li>Address: <span style={{fontFamily: 'monospace'}}>{props.user.address}</span></li>
          <li>Balance: {props.user.balance} AR</li>
        </ul>
      </section>
    )
}

export default Login;
