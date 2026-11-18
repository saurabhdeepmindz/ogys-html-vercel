/* WF-11 Upload History - order team. FR-003.9, FR-003.10 (reference FRD - confirm). */
(function () {
function Screen() {
  return <AppShell active="WF-11" title="Upload history" subtitle="Every upload kept as a batch, with the original file" actions={<OAct icon="download">Export</OAct>}>
    <FilterBar search="File name or dealer" filters={[{label: 'Brand', value: 'All'}, {label: 'Data type', value: 'All'}, {label: 'Date', value: 'Last 7 days'}, {label: 'Status', value: 'All'}]}/>
    <Panel pad={false} title={<span>Batches <Mark n={1}/></span>}>
      <DataTable cardTitle="b" columns={[{key: 'b', label: 'Batch', mono: true}, {key: 'when', label: 'Date and time', nowrap: true}, {key: 'who', label: 'User'}, {key: 'd', label: 'Dealer · data type'},
        {key: 'f', label: 'Files', align: 'right'}, {key: 'rows', label: 'Rows', align: 'right'}, {key: 'st', label: 'Status'}, {key: 'dl', label: <span>Original<Mark n={2}/></span>, align: 'right'}]}
        rows={[['UB-26-11871', '05-11 08:12', 'Ritu S.', 'STAR GROUP · Current Stock', 3, '8,876', 'exception'], ['UB-26-11870', '05-11 08:05', 'Ritu S.', 'STAR GROUP · Pending PO', 2, '316', 'ready'],
               ['UB-26-11866', '04-11 18:40', 'Aman K.', 'Prakash Auto · Current Stock', 1, '2,240', 'ready'], ['UB-26-11851', '04-11 10:02', 'Aman K.', 'Shivam Motors · OEM invoice', 1, '1,128', 'exception']]
          .map((r, i) => ({key: i, b: r[0], when: r[1], who: r[2], d: r[3], f: r[4], rows: r[5], st: <OState s={r[6]}/>, dl: <OAct small icon="file-down">Download</OAct>}))}/></Panel>
    <Ask id="CQ-17"><Note>Original files are kept so any order can be traced back to the data it was built on.<Mark n={3} open/></Note></Ask>
  </AppShell>;
}
WFScreen('WF-11', Screen);
})();
