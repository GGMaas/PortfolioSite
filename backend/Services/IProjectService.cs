using C__.DTOs;
namespace C__.Services;

public interface IProjectService
{
    List<ProjectResponseDto> GetAll();
    ProjectResponseDto? GetById(int id);
    ProjectResponseDto Create(CreateProjectDto dto);

    bool Update(int id, CreateProjectDto dto);
    bool Delete(int id);
}