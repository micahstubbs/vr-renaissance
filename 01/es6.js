
const svg = d3.select("svg"), margin = {top: 20, right: 20, bottom: 30, left: 70}, width = +svg.attr("width") - margin.left - margin.right, height = +svg.attr("height") - margin.top - margin.bottom;

const x = d3.time.scale()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([0, width]);

const y = d3.scaleLinear().rangeRound([height, 0]);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data.csv", d => {
  d.unitsShipped = +d.unitsShipped;

  return d;
}, (error, data) => {
  if (error) throw error;


  x.domain(data.map(d => d.letter));
  y.domain([0, d3.max(data, d => d.unitsShipped)]);

  const xAxis = d3.axisBottom(x)
    .ticks(d3.timeMonths)
    .tickSize(16, 0)
    .tickFormat(d3.timeFormat("%B"));

  const yAxis = d3.axisLeft(y)
    .ticks(10, ",.0f");

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  g.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.letter))
      .attr("y", d => y(d.frequency))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.frequency));
});