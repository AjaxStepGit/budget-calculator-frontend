import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Transaction {
  date: string;
  amount: number;
}

interface ParsedTransaction {
  date: Date;
  amount: number;
}

interface Props {
  transactions: Transaction[];
}

const TransactionLineChart: React.FC<Props> = ({ transactions }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!transactions || transactions.length === 0 || !svgRef.current || !wrapperRef.current) return;

    const containerWidth = wrapperRef.current.clientWidth;
    const width = containerWidth;
    const height = 300;
    const margin = { top: 10, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const parsedData: ParsedTransaction[] = transactions.map(d => ({
      ...d,
      date: new Date(d.date),
      amount: typeof d.amount === 'string' ? parseFloat(d.amount) : d.amount,
    }));

    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.amount)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<ParsedTransaction>()
      .x(d => x(d.date))
      .y(d => y(d.amount));

    svg
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const chart = svg.append('g');

    // Line path
    chart.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#2196f3")
      .attr("stroke-width", 2)
      .attr("d", line!)
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);

    // X-axis
    chart.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(width < 400 ? 3 : 6)
          .tickFormat(d => d3.timeFormat('%b %d')(d as Date))
      )
      .selectAll("text")
      .style("font-size", "10px");

    // Y-axis
    chart.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "10px");

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 2px 5px rgba(0,0,0,0.2)")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("z-index", "1000");

    // Data points
    chart.selectAll("circle")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.amount))
      .attr("r", 4)
      .attr("fill", "#2196f3")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 6)
          .attr("fill", "#0d47a1");

        const tooltipX = event.pageX + 10;
        const tooltipY = event.pageY - 28;

        tooltip
          .style("opacity", 1)
          .html(`<strong>₹${d.amount}</strong><br>${d3.timeFormat('%b %d')(d.date)}`)
          .style("left", `${tooltipX}px`)
          .style("top", `${tooltipY}px`);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 4)
          .attr("fill", "#2196f3");

        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [transactions]);

  return (
    <div ref={wrapperRef} className="w-full overflow-x-auto">
      <svg ref={svgRef} />
    </div>
  );
};

export default TransactionLineChart;
