import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function TestD3Chart() {
    const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const data = [10, 15, 20, 25, 30];

    const svg = d3.select(chartRef.current)
      .attr('width', 300)
      .attr('height', 200);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 60)
      .attr('y', d => 200 - d * 5)
      .attr('width', 40)
      .attr('height', d => d * 5)
      .attr('fill', '#4caf50');

  }, []);

  return <svg ref={chartRef}></svg>;
}
