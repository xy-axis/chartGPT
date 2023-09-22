import { Legend } from '@tremor/react';
import React from 'react';
import {
  Bar,
  Pie,
  PieChart,
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Treemap,
  XAxis,
  YAxis,
} from 'recharts';
import { CustomCell } from './CustomCell';
import { Tooltip } from './CustomTooltip';

export type Color =
  | 'blue'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink';
interface ChartProps {
  data: any;
  chartType: string;
  color?: Color;
  showLegend?: boolean;
}

interface CustomizedLabelProps {
  name: string,
  value: string
}

const Colors = {
  blue: '#3b82f6',
  sky: '#0ea5e9',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  emerald: '#10b981',
  green: '#22c55e',
  lime: '#84cc16',
  yellow: '#eab308',
  amber: '#f59e0b',
  orange: '#f97316',
  red: '#ef4444',
  rose: '#f43f5e',
  pink: '#ec4899',
  fuchsia: '#d946ef',
  purple: '#a855f7',
  violet: '#8b5cf6',
  indigo: '#6366f1',
  neutral: '#737373',
  stone: '#78716c',
  gray: '#6b7280',
  slate: '#64748b',
  zinc: '#71717a',
};

export const getTremorColor: (color: Color) => string = (color: Color) => {
  switch (color) {
    case 'blue':
      return Colors.blue;
    case 'sky':
      return Colors.sky;
    case 'cyan':
      return Colors.cyan;
    case 'teal':
      return Colors.teal;
    case 'emerald':
      return Colors.emerald;
    case 'green':
      return Colors.green;
    case 'lime':
      return Colors.lime;
    case 'yellow':
      return Colors.yellow;
    case 'amber':
      return Colors.amber;
    case 'orange':
      return Colors.orange;
    case 'red':
      return Colors.red;
    case 'rose':
      return Colors.rose;
    case 'pink':
      return Colors.pink;
    case 'fuchsia':
      return Colors.fuchsia;
    case 'purple':
      return Colors.purple;
    case 'violet':
      return Colors.violet;
    case 'indigo':
      return Colors.indigo;
    case 'neutral':
      return Colors.neutral;
    case 'stone':
      return Colors.stone;
    case 'gray':
      return Colors.gray;
    case 'slate':
      return Colors.slate;
    case 'zinc':
      return Colors.zinc;
  }
};

export const getSecondColor: (color: Color) => string = (color: Color) => {
  switch (color) {
    case 'blue':
      return Colors.sky;
    case 'sky':
      return Colors.blue;
    case 'cyan':
      return Colors.teal;
    case 'teal':
      return Colors.cyan;
    case 'emerald':
      return Colors.green;
    case 'green':
      return Colors.emerald;
    case 'lime':
      return Colors.yellow;
    case 'yellow':
      return Colors.lime;
    case 'amber':
      return Colors.orange;
    case 'orange':
      return Colors.amber;
    case 'red':
      return Colors.rose;
    case 'rose':
      return Colors.red;
    case 'pink':
      return Colors.fuchsia;
    case 'fuchsia':
      return Colors.pink;
    case 'purple':
      return Colors.violet;
    case 'violet':
      return Colors.purple;
    case 'indigo':
      return Colors.neutral;
    case 'neutral':
      return Colors.indigo;
    case 'stone':
      return Colors.gray;
    case 'gray':
      return Colors.stone;
    case 'slate':
      return Colors.zinc;
    case 'zinc':
      return Colors.slate;
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00C49F'];

const renderCustomizedLabel = (prop: any, valueKey: string) => {
  return `${prop.payload.name}-${prop.payload[valueKey]}`;
};

const calculateWidth = (number: number) => {
 return number * 40 > 500 ? number * 40 : 500
}

//TODO: dynamic keys instead of default value
export const Chart: React.FC<ChartProps> = ({
  data,
  chartType,
  color,
  showLegend = true,
}) => {
  const value = data.length > 0 ? Object.keys(data[0])[1] : 'value';

  const dataFormatter = (number: number) => {
    return Intl.NumberFormat('us').format(number).toString();
  };

  const renderChart = () => {
    chartType = chartType.toLowerCase();
    switch (chartType) {
      case 'area':
        return (
          // <AreaChart
          //   className="h-[300px]"
          //   data={data}
          //   index="name"
          //   categories={[value]}
          //   colors={[color || 'blue', 'cyan']}
          //   showLegend={showLegend}
          //   valueFormatter={dataFormatter}
          // />
          <>
          {showLegend && (
            <div className="flex justify-end">
              <Legend
                categories={[value]}
                colors={[color || 'blue', color || 'blue']}
                className="mb-5"
              />
            </div>
          )}
          <ComposedChart width={calculateWidth( data.length)} height={260} data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ transform: 'translate(0, 6)' }}
              style={{
                fontSize: '10px',
                fontFamily: 'Inter; Helvetica',
              }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              type="number"
              tick={{ transform: 'translate(-3, 0)' }}
              style={{
                fontSize: '10px',
                fontFamily: 'Inter; Helvetica',
              }}
            />
            <Tooltip legendColor={getTremorColor(color || 'blue')} />
            <Area
              dataKey="value"
              name="value"
              type="linear"
              fill={getTremorColor(color || 'blue')}
              label={(() => {
                return showLegend ? { fill: getTremorColor(color || 'blue'), fontSize: 14, position: 'top' } : false
              })()}
            >
            </Area>
          </ComposedChart>
        </>
        );
      case 'bar':
        return (
          <>
          {showLegend && (
            <div className="flex justify-end">
              <Legend
                categories={[value]}
                colors={[color || 'blue', color || 'blue']}
                className="mb-5"
              />
            </div>
          )}
          <div className='flex justify-center'>
            <ComposedChart width={calculateWidth( data.length)} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ transform: 'translate(0, 6)' }}
                style={{
                  fontSize: '10px',
                  fontFamily: 'Inter; Helvetica',
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: 'translate(-3, 0)' }}
                style={{
                  fontSize: '10px',
                  fontFamily: 'Inter; Helvetica',
                }}
              />
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Bar
                dataKey="value"
                name="value"
                type="linear"
                fill={getTremorColor(color || 'blue')}
                label={(() => {
                  return showLegend ? { fill: getTremorColor(color || 'blue'), fontSize: 14, position: 'top' } : false
                })()}
              >
              </Bar>
            </ComposedChart>
          </div>
        </>
        );
      case 'line':
        return (
          <>
          {showLegend && (
            <div className="flex justify-end">
              <Legend
                categories={[value]}
                colors={[color || 'blue', color || 'blue']}
                className="mb-5"
              />
            </div>
          )}
          <ComposedChart width={calculateWidth( data.length)} height={260} data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ transform: 'translate(0, 6)' }}
              style={{
                fontSize: '10px',
                fontFamily: 'Inter; Helvetica',
              }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              type="number"
              tick={{ transform: 'translate(-3, 0)' }}
              style={{
                fontSize: '10px',
                fontFamily: 'Inter; Helvetica',
              }}
            />
            <Tooltip legendColor={getTremorColor(color || 'blue')} />
            <Line
              type="linear"
              dataKey={value}
              stroke={getTremorColor(color || 'blue')}
              dot={false}
              strokeWidth={2}
              label={(() => {
                return showLegend ? { fill: getTremorColor(color || 'blue'), fontSize: 14, position: 'top' } : false
              })()}
            />
          </ComposedChart>
        </>
        );
      case 'composed':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
            <ComposedChart width={calculateWidth( data.length)} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ transform: 'translate(0, 6)' }}
                style={{
                  fontSize: '10px',
                  fontFamily: 'Inter; Helvetica',
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: 'translate(-3, 0)' }}
                style={{
                  fontSize: '10px',
                  fontFamily: 'Inter; Helvetica',
                }}
              />
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Bar
                dataKey="value"
                name="value"
                type="linear"
                fill={getSecondColor(color || 'blue')}
              />
              <Line
                type="linear"
                dataKey={value}
                stroke={getTremorColor(color || 'blue')}
                dot={false}
                strokeWidth={2}
                label={(() => {
                  return showLegend ? { fill: getTremorColor(color || 'blue'), fontSize: 14, position: 'top' } : false
                })()}
              />
            </ComposedChart>
          </>
        );
      case 'scatter':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
            <ScatterChart width={calculateWidth( data.length)} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ transform: 'translate(0, 6)' }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter; Helvetica',
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: 'translate(-3, 0)' }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter; Helvetica',
                }}
              />
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Scatter dataKey={value} fill={getTremorColor(color || 'blue')} 
                label={(() => {
                  return showLegend ? { fill: getTremorColor(color || 'blue'), fontSize: 14, position: 'top' } : false
                })()}/>
            </ScatterChart>
          </>
        );
      case 'pie':
        return (
          <PieChart width={500} height={300}>
            <Pie
              nameKey="name"
              cx="50%"
              cy="50%"
              data={data}
              dataKey={value}
              outerRadius={100}
              fill={getTremorColor(color || 'blue')}
              label={(props: any) => showLegend ? renderCustomizedLabel(props, value) : false}>
            </Pie>
          </PieChart>
        );

        // label={(() => {
        //   return showLegend ? { fill: getTremorColor(color || 'blue'), fontSize: 14, position: 'top' } : false
        // })()}
      case 'radar':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
            <RadarChart
              cx={250}
              cy={250}
              outerRadius={150}
              width={calculateWidth( data.length)}
              height={500}
              data={data}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Radar
                dataKey="value"
                stroke={getTremorColor(color || 'blue')}
                fill={getTremorColor(color || 'blue')}
                fillOpacity={0.6}
                label={(() => {
                  return showLegend ? { fill: getTremorColor(color || 'blue'), fontSize: 14, position: 'top' } : false
                })()}
              />
            </RadarChart>
          </>
        );
      // case 'radialbar':
      //   return (
      //     <>
      //       {showLegend && (
      //         <div className="flex justify-end">
      //           <Legend
      //             categories={[value]}
      //             colors={[color || 'blue', color || 'blue']}
      //             className="mb-5"
      //           />
      //         </div>
      //       )}
      //       <RadialBarChart
      //         width={calculateWidth( data.length)}
      //         height={300}
      //         cx={250}
      //         cy={150}
      //         innerRadius={20}
      //         outerRadius={140}
      //         barSize={10}
      //         data={data}
      //       >
      //         <RadialBar
      //           angleAxisId={15}
      //           label={{
      //             position: 'insideStart',
      //             fill: getTremorColor(color || 'blue'),
      //           }}
      //           dataKey="value"
      //         />
      //         <Tooltip legendColor={getTremorColor(color || 'blue')} />
      //       </RadialBarChart>
      //     </>
      //   );
      case 'treemap':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
            <Treemap
              width={calculateWidth( data.length)}
              height={260}
              data={data}
              dataKey="value"
              stroke="#fff"
              fill={getTremorColor(color || 'blue')}
              content={<CustomCell colors={Object.values(Colors)} name={value}/>}
            >
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
            </Treemap>
          </>
        );
      default:
        return <p>Unsupported chart type.</p>;
    }
  };

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <div className="overflow-scroll">
        {renderChart()}
      </div>
    </ResponsiveContainer>
  );
};

export default Chart;
