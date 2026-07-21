/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { createChart, getECModel } from '../../core/utHelper';
import { EChartsType } from '../../../../src/echarts';

describe('processor/dataStack', function () {

    let chart: EChartsType;
    beforeEach(function () {
        chart = createChart();
    });

    afterEach(function () {
        chart.dispose();
    });

    function getStackResult(seriesIndex: number, dataIndex: number): number {
        const data = getECModel(chart).getSeriesByIndex(seriesIndex).getData();
        const stackResultDim = data.getCalculationInfo('stackResultDimension');
        return data.get(stackResultDim, dataIndex) as number;
    }

    // Regression test for #21685: with `stackStrategy: 'all'`, a null/'-' value
    // in a lower series used to corrupt the stacked sum (NaN), making the upper
    // series' bar disappear. The null should be excluded from the stack instead.
    it('excludes null values from the stack when stackStrategy is "all" (#21685)', function () {
        chart.setOption({
            xAxis: { type: 'category', data: ['A', 'B', 'C'] },
            yAxis: { type: 'value' },
            series: [
                {
                    type: 'bar',
                    stack: 'total',
                    data: [10, null, 30]
                },
                {
                    type: 'bar',
                    stack: 'total',
                    stackStrategy: 'all',
                    data: [5, 5, 5]
                }
            ]
        });

        // Index 0 and 2: the lower series has valid values, so they stack normally.
        expect(getStackResult(1, 0)).toBe(15);
        expect(getStackResult(1, 2)).toBe(35);

        // Index 1: the lower series is null. It must be excluded from the stack,
        // so the upper series keeps its own value instead of becoming NaN.
        expect(getStackResult(1, 1)).toBe(5);
    });

});
