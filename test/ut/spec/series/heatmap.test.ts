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

import { createChart } from '../../core/utHelper';
import { EChartsType } from '../../../../src/echarts';

describe('series/heatmap', function () {

    let chart: EChartsType;
    beforeEach(function () {
        chart = createChart();
    });

    afterEach(function () {
        chart.dispose();
    });

    // Regression test for #19060: a heatmap whose coordinate system cannot be
    // resolved (e.g. `coordinateSystem: 'calendar'` without a calendar
    // component) used to throw "Cannot read properties of undefined (reading
    // 'type')" in HeatmapView.render, aborting the whole chart render.
    it('does not throw when the heatmap coordinate system is missing (#19060)', function () {
        function setMisconfiguredHeatmap() {
            chart.setOption({
                visualMap: {
                    min: 0,
                    max: 10,
                    calculable: true
                },
                series: [{
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: [['2023-01-01', 5]]
                }]
            });
        }

        expect(setMisconfiguredHeatmap).not.toThrow();
    });

});
