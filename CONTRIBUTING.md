# Contributing to Node API Postgres

Thank you for considering contributing to this project! We welcome all kinds of contributions, whether it's bug reports, feature suggestions, or code improvements. Please follow the guidelines below to make the contribution process smooth and effective.

## Getting Started

1. **Fork the Repository**: Start by forking the repository to your GitHub account.
2. **Clone the Fork**: Clone the repository to your local machine.
   ```bash
   git clone https://github.com/your-username/node-api-postgres.git
   ```
3. **Set Upstream**: Set the original repository as the upstream remote.
   ```bash
   git remote add upstream https://github.com/JawherKl/node-api-postgres.git
   ```

## Contribution Guidelines

### Reporting Issues

If you encounter a bug or have a feature request, please [open an issue](https://github.com/JawherKl/node-api-postgres/issues) with the following details:
- A clear and descriptive title
- Steps to reproduce the issue (if applicable)
- Expected behavior
- Actual behavior
- Any relevant screenshots or error messages

### Submitting Pull Requests

1. **Branch from `main`**: Always create a new branch from the `main` branch for your work.
   ```bash
   git checkout -b feature/id-or-bugfix-name
   ```
2. **Write Clean Code**: Follow the existing code style and add comments where necessary.
3. **Run Tests**: Ensure all existing tests pass and add new tests if applicable.
   ```bash
   npm test
   ```
4. **Commit Messages**: Write meaningful and descriptive commit messages.
   ```bash
   git commit -m "Add feature X or fix issue Y"
   ```
5. **Push Changes**: Push your branch to your fork.
   ```bash
   git push origin feature/id-or-bugfix-name
   ```
6. **Create a Pull Request**: Submit a pull request to the `main` branch of the original repository. Provide a detailed description of your changes and reference any relevant issues.

### Code of Conduct

Please note that this project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment**:
   Create a `.env` file in the root directory and configure the required environment variables. Refer to `.env.example` for guidance.
3. **Run the Application**:
   ```bash
   npm start
   ```
4. **Run Tests**:
   ```bash
   npm test
   ```

## Suggestions and Feedback

We are open to suggestions and feedback! Feel free to start a discussion in the [Discussions](https://github.com/JawherKl/node-api-postgres/discussions) tab.

Thank you for your contributions! Together, we can make this project better.

