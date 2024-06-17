const Connected = (props) => {
    return (
      <div className="connected-container">
        <h1 className="connected-header">You are Connected to Metamask</h1>
        <p className="connected-account">Metamask Account: {props.account}</p>
        <p className="connected-account">Remaining Time: {props.remainingTime}</p>
        { props.showButton ? (
          <p className="connected-account">You have already voted</p>
        ) : (
          <div>
            <input 
              type="number" 
              placeholder="Enter Candidate Index" 
              value={props.number} 
              onChange={(e) => props.handleNumberChange(e.target.value)}
              aria-label="Enter Candidate Index"
              aria-describedby="candidate-index-input"
            />
            <br />
            <button 
              className="login-button" 
              onClick={props.voteFunction} 
              aria-label="Vote Button"
            >
              Vote
            </button>
          </div>
        )}
        
        <table id="myTable" className="candidates-table" aria-label="Candidates Table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Candidate name</th>
              <th>Candidate votes</th>
            </tr>
          </thead>
          <tbody>
            {props.candidates.map((candidate, index) => (
              <tr key={candidate.index}>
                <td>{candidate.index}</td>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default Connected;