export function Weave() {
  return <div className="weave" aria-hidden="true">
    {Array.from({length: 40}, (_,i) => <span key={i}/>)}
    <i className="band a"/><i className="band b"/>
  </div>;
}
