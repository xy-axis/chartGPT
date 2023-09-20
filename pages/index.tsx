import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
  PresentationChartLineIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  Callout,
  Card,
  Col,
  Color,
  Divider,
  Grid,
  Subtitle,
  Text,
  Title,
} from '@tremor/react';
import axios from 'axios';
import downloadjs from 'downloadjs';
import { AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { NextPage } from 'next';
import { useCallback, useMemo, useState } from 'react';
import Chart from '../components/ChartComponent';
import LoadingDots from '../components/LoadingDots';
import { SegmentedControl } from '../components/atoms/SegmentedControl';
import { IconColor, Select } from '../components/atoms/Select';
import { TextArea } from '../components/atoms/TextArea';
import { Toggle } from '../components/atoms/Toggle';

const SectionHeader = ({
  stepNumber,
  title,
}: {
  stepNumber: number;
  title: string;
}) => {
  return (
    <div className="flex items-center">
      <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-500 font-semi-bold font-mono mr-2 h-6 w-6 rounded-full flex items-center justify-center">
        {stepNumber}
      </div>
      <Subtitle className="text-gray-700 dark:text-gray-300">{title}</Subtitle>
    </div>
  );
};

const CHART_TYPES = [
  'area',
  'bar',
  'line',
  'composed',
  'scatter',
  'pie',
  'radar',
  'radialbar',
  'treemap',
  'funnel',
];

const prefixPrompt = `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12, "color": "#4285F4" }] for Recharts API. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric.\n Make sure the format use double quotes and property names are string literals.`;

const initPrompt = () => {
  let prompt
  if (typeof window !== 'undefined') {
    prompt = localStorage.getItem('prompt')
  }
  return prompt || prefixPrompt
}

const setPrompt = (prompt : string): void => {
  localStorage.setItem('prompt', prompt)
}

const NewHome: NextPage = () => {
  const [inputValue, setInputValue] = useState('请用条形图展示数据，星期一-15人，星期二-3人，星期三-45人，星期四-124人，星期五-2人。');
  const [promptValue, setPromptValue] = useState(initPrompt());
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(false);
  const [shouldRenderChart, setShouldRenderChart] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [chartColor, setChartColor] = useState<Color>('blue');

  const chartComponent = useMemo(() => {
    return (
      <Chart
        data={chartData}
        chartType={chartType}
        color={chartColor as Color}
        showLegend={showLegend}
      />
    );
  }, [chartData, chartType, chartColor, showLegend]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  const handlePromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPromptValue(event.target.value);
      setPrompt(event.target.value)
    },
    []
  );

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setError(false);
    setIsLoading(true);

    try {
      const chartTypeResponse = await axios.post('/api/get-type', {
        inputData: inputValue,
      });

      if (!CHART_TYPES.includes(chartTypeResponse.data.toLowerCase()))
        return setError(true);

      setChartType(chartTypeResponse.data);

      const libraryPrompt = `${promptValue}\n\n${inputValue}\n Provide JSON data only. `;

      const chartDataResponse = await axios.post('/api/parse-graph', {
        prompt: libraryPrompt,
      });

      let parsedData;

      try {
        parsedData = JSON.parse(chartDataResponse.data);
      } catch (error) {
        setError(true);
        console.error('Failed to parse chart data:', error);
      }

      setChartData(parsedData);
      setChartType(chartTypeResponse.data);
      setShouldRenderChart(true);
    } catch (error) {
      setError(true);
      console.error('Failed to generate graph data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = async (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      return;
    }
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL('image/png');
    downloadjs(dataURL, 'chart.png', 'image/png');
  };

  console.log({ chartData });

  return (
    <Grid
      numCols={1}
      numColsSm={2}
      numColsLg={3}
      className="gap-y-4 lg:gap-x-4 h-full"
    >
      <aside className="h-full shrink-0 w-full flex flex-col justify-between lg:col-span-1 col-span-2 order-last lg:order-first">
        <form id="generate-chart" onSubmit={handleSubmit} className="space-y-4">
          <SectionHeader
            stepNumber={1}
            title="你想要可视化什么？"
          />
          <TextArea
            id="input"
            name="prompt"
            placeholder="请用条形图展示数据，星期一-15人，星期二-3人，星期三-45人，星期四-124人，星期五-2人。"
            value={inputValue}
            required
            autoFocus
            onChange={handleInputChange}
            onKeyDown={event => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                handleSubmit(event);
              }
            }}
          />
          <Button
            type="button"
            variant="light"
            className="w-full outline-none focus:outline-none ring-0 focus:ring-0"
            icon={showAdvanced ? ChevronUpIcon : ChevronDownIcon}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            高级设置
          </Button>

          <AnimatePresence initial={false}>
            {showAdvanced && (
              <div className="space-y-4">
                <div>
                  <Text className="mb-1 dark:text-zinc-400">图表类型</Text>
                  <Select
                    name="chart-type"
                    value={chartType}
                    onValueChange={setChartType}
                    items={[
                      { value: 'bar', textValue: '柱状图' },
                      { value: 'area', textValue: '面积图' },
                      { value: 'line', textValue: '折线图' },
                      { value: 'composed', textValue: '组合图表' },
                      { value: 'pie', textValue: '饼图' },
                      { value: 'scatter', textValue: '散点图' },
                      { value: 'radar', textValue: '雷达图' },
                      { value: 'radialbar', textValue: '径向条形图' },
                      { value: 'treemap', textValue: '树状图' },
                      { value: 'funnel', textValue: '漏斗图' },
                    ]}
                  />
                </div>
                <div>
                  <Text className="mb-1 dark:text-zinc-400">前置提示词</Text>
                  <TextArea
                    id="input"
                    name="prompt"
                    placeholder="请输入前置提示词"
                    value={promptValue}
                    required
                    autoFocus
                    onChange={handlePromptChange}
                    onKeyDown={event => {}}
                  />
                  <Button
                    type="button"
                    variant="light"
                    className="w-full outline-none focus:outline-none ring-0 focus:ring-0"
                    onClick={() => setPromptValue(prefixPrompt)}
                  >
                    重置前置提示词
                  </Button>
                  <div
                    className='w-full outline mt-5 br-5 p-2 rounded'>
                    {`${promptValue}\n\n${inputValue}\n Provide JSON data only. `}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          <div className="py-2">
            <Divider className="h-px dark:bg-zinc-800" />
          </div>

          <SectionHeader stepNumber={2} title="调整图表样式" />
          <div>
            <label
              htmlFor="title"
              className="text-zinc-500 dark:text-zinc-400 text-sm font-normal select-none	mb-3"
            >
              颜色
            </label>
            <Select
              value={chartColor as Color}
              onValueChange={value => setChartColor(value as Color)}
              leftIcon={SwatchIcon}
              leftIconColor={chartColor as IconColor}
              items={[
                { value: 'blue', textValue: '蓝色' },
                { value: 'purple', textValue: '紫色' },
                { value: 'green', textValue: '绿色' },
                { value: 'pink', textValue: '粉色' },
                { value: 'yellow', textValue: '黄色' },
              ]}
            />
          </div>

          <div className="flex justify-between w-full">
            <label
              htmlFor="title"
              className="text-zinc-500 dark:text-zinc-400 text-sm font-normal select-none	"
            >
              展示图表标题
            </label>
            <Toggle
              id="title"
              size="sm"
              label="Show chart Title"
              checked={showTitle}
              setChecked={setShowTitle}
            />
          </div>
          <div className="flex justify-between w-full">
            <label
              htmlFor="legend"
              className="text-zinc-500 dark:text-zinc-400 text-sm font-normal select-none	"
            >
              显示图例
            </label>
            <Toggle
              id="legend"
              size="sm"
              label="Show chart Legend"
              checked={showLegend}
              setChecked={setShowLegend}
            />
          </div>
        </form>
        <Button
          type="submit"
          form="generate-chart"
          className="w-full"
          icon={PencilSquareIcon}
        >
          绘制图表
        </Button>
      </aside>

      <Col
        numColSpan={1}
        numColSpanSm={2}
        numColSpanMd={2}
        className="bg-zinc-100 rounded-md py-12 px-4 lg:py-4 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 h-full dot-grid-gradient-light dark:dot-grid-gradient-dark flex justify-center items-center relative"
      >
        <div className="flex absolute top-4 right-4 space-x-4">
          {(chartData == undefined || chartData?.length > 0) && (
            <Button
              variant="light"
              color="gray"
              icon={ArrowPathIcon}
              className="dark:text-zinc-100 dark:hover:text-zinc-300 outline-none"
              type="submit"
              form="generate-chart"
            >
              重试
            </Button>
          )}
          {shouldRenderChart && (
            <Button
              size="xs"
              color="gray"
              icon={ArrowDownTrayIcon}
              className="dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 outline-none"
              onClick={() => handleDownloadClick('#chart-card')}
            >
              下载
            </Button>
          )}
        </div>

        {error ? (
          <Callout
            className="mb-6"
            title="抱歉！无法生成"
            color="rose"
          >
            请稍后再试或重新调整您的请求。
          </Callout>
        ) : (
          <div className="w-full max-w-xl p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <LoadingDots />
              </div>
            ) : (
              shouldRenderChart && (
                <Card
                  id="chart-card"
                  className="bg-white dark:bg-black dark:ring-zinc-800"
                >
                  {showTitle && (
                    <Title className="dark:text-white">{inputValue}</Title>
                  )}
                  {!showLegend && <div className="h-5" />}
                  {chartComponent}
                </Card>
              )
            )}
          </div>
        )}
      </Col>
    </Grid>
  );
};

export default NewHome;
