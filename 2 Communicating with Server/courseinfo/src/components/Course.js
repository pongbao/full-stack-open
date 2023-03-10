const Header = ({ course }) => <h2>{course}</h2>;

const Total = ({ sum }) => <p>total of {sum} exercises</p>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => {
  return parts.map((part) => <Part part={part} key={part.id} />);
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        sum={course.parts
          .map((part) => part.exercises)
          .reduce((sum, count) => sum + count, 0)}
      />
    </>
  );
};

export default Course;
