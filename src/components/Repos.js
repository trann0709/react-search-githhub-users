import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = useGlobalContext();
  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total; // if language is null, return
    if (!total[language]) {
      // if the total[language] does not exist
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  // Turn this languages object into an array - Pie3D
  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value; // sort the languages
    })
    .slice(0, 5); // get the top 5 languages

  // most stars per language
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      //overide the values as the chart is looking for label/value data
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  // stars,
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    { stars: {}, forks: {} }
  );

  stars = Object.values(stars).slice(-5).reverse(); //get the last 5 then reverse the array to get descending order
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
