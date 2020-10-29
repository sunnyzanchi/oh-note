import { expect, test } from '@jest/globals'
import { makeHierarchical } from './makeHierarchical'

test('makeHierarchical', () => {
  const input = [
    { name: 'Places' },
    { name: 'Places/New York' },
    { name: 'Places/New York/Manhattan' },
    { name: 'Places/New York/Brooklyn' },
    { name: 'Places/Louisville/Highlands' },
    { name: 'Places/Louisville/St Matthews' },
    // There is no top-level Food tag in the list of tags,
    // but we stil want a top-level Food tag returned,
    // as these other tags are nested below it
    { name: 'Food/Vegetables/Carrots' },
    { name: 'Food/Vegetables/Onions' },
    { name: 'Food/Fruits/Apples' },
    { name: 'Food/Grains' },
  ]

  const expected = [
    {
      children: [
        {
          children: [
            // @ts-ignore
            { children: [], name: 'Manhattan' },
            { children: [], name: 'Brooklyn' },
          ],
          name: 'New York',
        },
        {
          children: [
            { children: [], name: 'Highlands' },
            { children: [], name: 'St Matthews' },
          ],
          name: 'Louisville',
        },
      ],
      name: 'Places',
    },
    {
      children: [
        {
          children: [
            { children: [], name: 'Carrots' },
            { children: [], name: 'Onions' },
          ],
          name: 'Vegetables',
        },
        {
          children: [{ children: [], name: 'Apples' }],
          name: 'Fruits',
        },
        { children: [], name: 'Grains' },
      ],
      name: 'Food',
    },
  ]

  const result = makeHierarchical(input)
  expect(result).toEqual(expected)
})
