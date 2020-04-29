import React, {useState, useEffect} from 'react';
import './App.css';

import Login from './components/Login';
import PaintBoard from './components/PaintBoard';

import Arweave from 'arweave/web'
import config from './config'

function App() {
  const [stateUser, setUser] = useState()
  const [stateAppData, setAppData] = useState([])
  const [stateLoading, setLoading] = useState(true)
  const [stateColor, setColor] = useState("#000000")
  const [stateArweave, setArweave] = useState()
  const [stateWait, setWait] = useState(false)

  const isJsonString = (str) => {
    try{
      JSON.parse(str)
    }
    catch(e){
      return false
    }
    return true
  }

  useEffect(() => {
    const arweave = Arweave.init();
    setArweave(arweave)

    arweave.arql({
      op: "equals",
      expr1: "appname",
      expr2: "decentrapaint-dev"
    }).then(txids => {
      let promises = txids.map(tx => arweave.transactions.getData(tx, {decode: true, string: true}))
      Promise.all(promises).then((appData) => {
        //filter and sanitize data
        appData = appData
        .filter(str => isJsonString(str))
        .map(jsonStr => JSON.parse(jsonStr))
        .filter(obj =>
          obj?.x >= 0 && obj?.x < config.WIDTH &&
          obj?.y >= 0 && obj?.y < config.HEIGHT &&
          obj.color && /^#[0-9a-f]{6}$/.test(obj.color)
        )
        console.log(appData);
        setAppData(appData)
        setLoading(false)
      })
    })
    .catch((err) => console.log)
  }, []);

  const drawTransaction = async (x, y) => {
    if(!stateUser) {
      alert('Please login by uploading your Arweave file in order to paint on the board')
      return
    }
    if(!stateWait){
      setWait(true)
      let transaction = await stateArweave.createTransaction({
        data: JSON.stringify({x: x, y: y, color: stateColor})
      }, stateUser.jwk);
      transaction.addTag('Content-Type', 'application/json');
      transaction.addTag('appname', 'decentrapaint-dev');
      await stateArweave.transactions.sign(transaction, stateUser.jwk);

      const response = await stateArweave.transactions.post(transaction);
      if(response.status === 200)
        setAppData([...stateAppData, {x: x, y: y, color: stateColor}])
      else
        alert(`something wrong happened when sending the transaction: Error ${response.status}`)
      setWait(false)
    }

  }

  const handlePickingColor = color => {
    setColor(color.hex)
  }

  return (
    <main className="App">
      <header>
        Decentrapaint
      </header>
      <Login
        user={stateUser}
        setUser={setUser}
        arweave={stateArweave}
        pickColor={handlePickingColor}
      />
      <section>
        {stateLoading && <div>loading painting board</div>}
        {!stateLoading &&
          <PaintBoard
            colorPositions={stateAppData}
            onDraw={drawTransaction}
            color={stateColor}
          />
        }
      </section>
    </main>
  );
}

export default App;
