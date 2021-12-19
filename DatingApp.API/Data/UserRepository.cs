using API.Dtos;
using API.Entities;
using API.Helders;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        readonly DataContext context;
        readonly IMapper mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        public async Task<MemberDto> GetMemberAsync(string userName)
        {
            return await context.Users
                .Where(x => x.UserName == userName)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }
        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);
            var minDob = DateTime.Now.AddYears(-userParams.MinAge - 1);
            var maxAge = DateTime.Now.AddYears(-userParams.MaxAge - 1);
            query = query.Where(u => u.DateOfBirth >= maxAge  && u.DateOfBirth <= minDob);
            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            return await PagedList<MemberDto>.CreateAsync(
                query
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .AsNoTracking(),
                userParams.PageNumber,
                userParams.PageSize);
        }
        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string userName)
        {
            return await context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == userName);
        }
        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }
        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
        public void Update(AppUser user)
        {
            context.Entry(user).State = EntityState.Modified;
        }
    }
}
