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

import { EChartsType, registerMap } from '../../../../../src/echarts';
import { GeoJSON } from '../../../../../src/coord/geo/geoTypes';
import { createChart } from '../../../core/utHelper';

describe('geo', function () {

    const testGeoJson: GeoJSON = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        [
                            [0, 0],
                            [10, 0],
                            [10, 10],
                            [0, 10]
                        ]
                    ]
                },
                'properties': {
                    'name': 'A',
                    'childNum': 1
                }
            }
        ]
    };
    registerMap('geo_test_zero_size', testGeoJson);

    let chart: EChartsType;
    afterEach(function () {
        chart.dispose();
    });

    it('should not throw when the chart size is zero', function () {
        // A hidden (display:none) container makes the chart 0x0. The geo view
        // transform is singular then and must not crash. See #21706.
        chart = createChart({ opts: { width: 0, height: 0 } });
        expect(function () {
            chart.setOption({
                geo: {
                    map: 'geo_test_zero_size'
                },
                series: [
                    {
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: [{ name: 'x', value: [5, 5, 1] }]
                    }
                ]
            });
        }).not.toThrow();
    });
});
