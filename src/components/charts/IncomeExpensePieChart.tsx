import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  income: number;
  expense: number;
}

const IncomeExpensePieChart: React.FC<Props> = ({ income, expense }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data = [
      { label: 'Income', value: income },
      { label: 'Expense', value: expense },
    ];

    const wrapper = wrapperRef.current;
    if (!wrapper || !svgRef.current) return;

    const containerWidth = wrapper.clientWidth;
    const height = 300;
    const radius = Math.min(containerWidth, height) / 2 - 20;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", "100%")
      .attr("height", height + 100)
      .attr("viewBox", `0 0 ${containerWidth} ${height + 100}`);

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(["#4caf50", "#f44336"]);

    const pie = d3.pie<{ label: string; value: number }>().value((d) => d.value);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${containerWidth / 2}, ${height / 2})`);

    chart
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Legend under chart
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${containerWidth / 2 - 50}, ${height + 20})`
      );

    legend
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (_, i) => i * 25)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => color(d.label));

    legend
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 25)
      .attr("y", (_, i) => i * 25 + 13)
      .text((d) => `${d.label} (${d.value})`)
      .style("font-size", "12px");
  }, [income, expense]);

  return (
    <div ref={wrapperRef} className="w-full overflow-x-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IncomeExpensePieChart;
