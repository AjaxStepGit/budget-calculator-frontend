import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BudgetBarChartProps {
  budget: number;
  expense: number;
}

const BudgetBarChart: React.FC<BudgetBarChartProps> = ({ budget, expense }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data = [
      { label: 'Budget', value: budget },
      { label: 'Expense', value: expense },
    ];

    const wrapper = wrapperRef.current;
    if (!wrapper || !svgRef.current) return;

    const containerWidth = wrapper.clientWidth;
    const margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = 200;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", "100%")
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, width])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(budget, expense)])
      .nice()
      .range([height, 0]);

    // Bars
    chart
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label)!)
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => (d.label === "Expense" ? "#f44336" : "#4caf50"))
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));

    // Y Axis
    chart
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("font-size", "10px");

    // X Axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px");
  }, [budget, expense]);

  return (
    <div ref={wrapperRef} className="w-full max-w-full overflow-x-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BudgetBarChart;
